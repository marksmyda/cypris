import { Component, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageModule } from 'primeng/message';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { CoreServiceService } from './core-service.service';
import { Aggregation, CoreInterface, Result } from './core-interface';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { formatDate, NgIf, NgFor } from '@angular/common';
import { Table } from 'primeng/table';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';


interface ColumnDef {
    field: string;
    header: string;
    sortable: boolean;
    type: 'text' | 'date' | 'author' | 'number'
}

interface ChartData {
    labels: string[];
    datasets: {
        data: number[];
    }[]
}

const INITIAL_TABLE_DATA = {
    totalHits: 0,
    limit: 0,
    offset: 0,
    results: [],
    searchId: ''
};

@Component({
    selector: 'cypris',
    templateUrl: 'cypris.html',
    standalone: true,
    imports: [ButtonModule, TableModule, ReactiveFormsModule, ChartModule, ProgressSpinnerModule, IconFieldModule, InputIconModule, NgIf, MessageModule, NgFor]
})
export class Cypris {
    @ViewChild('dt') dt!: Table;

    data: CoreInterface = INITIAL_TABLE_DATA;
    columns: ColumnDef[] = [
        { field: 'id', header: 'ID', sortable: true, type: 'number' },
        { field: 'doi', header: 'DOI', sortable: false, type: 'text' },
        { field: 'title', header: 'Title', sortable: false, type: 'text' },
        { field: 'publishedDate', header: 'Published Date', sortable: true, type: 'date' },
        { field: 'acceptedDate', header: 'Accepted Date', sortable: true, type: 'date' },
        { field: 'authors', header: 'Authors', sortable: false, type: 'author' },
        { field: 'publisher', header: 'Publisher', sortable: false, type: 'text' },
    ]

    searchInvalid = new BehaviorSubject(false);

    chartData: ChartData = {
        labels: [],
        datasets: [
            {
                data: []
            }
        ]
    };

    chartOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            x: {
                title: { display: true, text: 'Year published' }
            },
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Total' },
                ticks: { precision: 0 } 
            }
        }
    };
    
    loading: boolean = false;
    errorMsg: string | null = null;

    constructor(private coreService: CoreServiceService) {}

    expandedRows: Record<string, boolean> = {};

    ngOnInit(): void {
        this.fetchChartData('');
    }

    onSearch(term: string): void {
        const valid = this.isGroupingValid(term);
        this.searchInvalid.next(!valid);
        if (!valid) return;

        this.dt.filterGlobal(term, 'contains');
        this.fetchChartData(term);
    }

    getAuthorNames(authors: Result['authors']): string {
        return authors.map(author => author.name).join(', ');
    }

    getDateFromString(value: string): string {
        try {
            return formatDate(new Date(value), 'yyyy MMM dd', 'en');
        } catch {
            return 'Invalid Date';
        }
    }

    cellExport(cell: { data: unknown, field: string }) {
        const columnDef = this.columns.find(col => col.field === cell.field)!;
        return this.formatCell(cell.data, columnDef)
    }

    formatCell(value: unknown, col: ColumnDef): string {
        switch (col.type) {
            case 'author':   return this.getAuthorNames(value as Result['authors'])
            case 'date':     return this.getDateFromString(value as string)
            default:         return String(value ?? '');
        }
    }

    private handleError(err: HttpErrorResponse) {
        if (err.status === 429) {
            this.errorMsg = 'Too many requests - please pause a moment and try again.';
        } else if (err.status === 500) {
            this.errorMsg = 'Sorry, the server ran into a problem. Please try again later.';
        } else {
            this.errorMsg = 'Unexpected error (' + err.status + ').';
        }
    }

    loadPage($event: TableLazyLoadEvent) {
        this.loading = true;
        this.errorMsg = null;

        const pagination = {
            limit: $event.rows ?? 10,
            offset: $event.first ?? 0
        }

        if (Array.isArray($event.sortField)) {
            throw new Error('Multidimensional sort is not supported');
        }

        const sort = ($event.sortField) ? {
            field: $event.sortField,
            order: $event.sortOrder ?? 1
        } : undefined;

        const term = $event.globalFilter ?? ''
        if (Array.isArray(term)) {
            throw new Error('Multidimensional search is not supported');
        }

        this.coreService.getCoreData(term, pagination, sort).subscribe({
            next: (data) => {
                this.loading = false;
                this.data = data;
            },
            error: (error) => {
                this.loading = false;
                this.data = INITIAL_TABLE_DATA;
                this.handleError(error);
            },
        });
    }

    isGroupingValid(search: string): boolean {
        const groupings = search.replace(/[^()]/g, '');
        if (groupings === '') {
            return true;
        }

        const stack = [];
        for (const char of groupings) {
            if (char === '(') {
                stack.push(char);
                continue;
            }

            if (stack.length === 0) {
                return false;
            }

            stack.pop();
        }

        return stack.length === 0;
    }

    private toChartData(agg: Aggregation): ChartData {
        const years = agg['aggregations']['yearPublished'];
        return {
            labels: Object.keys(years),
            datasets: [
                {
                    data: Object.values(years)
                }
            ]
        }
    }

    fetchChartData(search: string) {
        this.coreService.postForAggregation(search, ['yearPublished']).subscribe({
            next: (data) => {
                this.chartData = this.toChartData(data);
            },
            error: (error) => {
                console.log(error);
            }
        });
    }
}
