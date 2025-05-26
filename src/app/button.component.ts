import { Component, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageModule } from 'primeng/message';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { CoreServiceService } from './core-service.service';
import { CoreInterface, Result } from './core-interface';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { formatDate, NgIf } from '@angular/common';
import { Table } from 'primeng/table';
import { HttpErrorResponse } from '@angular/common/http';

const NO_DATA = {
    totalHits: 0,
    limit: 0,
    offset: 0,
    results: [],
    searchId: ''
};

@Component({
    selector: 'button-demo',
    templateUrl: 'button-demo.html',
    standalone: true,
    imports: [ButtonModule, TableModule, ReactiveFormsModule, ChartModule, ProgressSpinnerModule, IconFieldModule, InputIconModule, NgIf, MessageModule]
})
export class ButtonDemo {
    @ViewChild('dt') dt!: Table;

    data: CoreInterface = NO_DATA;

    fieldData = {
        labels: ["A", "B", "C"],
        datasets: [
            {
                data: [150, 50, 100],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
            }
        ]
    };

    private timerId: number | undefined;
    
    loading: boolean = false;
    errorMsg: string | null = null;

    constructor(private coreService: CoreServiceService) {}

    expandedRows: Record<string, boolean> = {};
    
    ngOnDestroy() {
        clearTimeout(this.timerId)
    }

    onSearch(term: string): void {
        clearTimeout(this.timerId);
        this.timerId = window.setTimeout(() => {
            this.dt.filterGlobal(term, 'contains');
        }, 450);
    }

    getAuthorNames(result: Result): string {
        return result.authors.map(author => author.name).join(', ');
    }

    getDateFromString(result: Result): string {
        return formatDate(new Date(result.publishedDate), 'yyyy MMM dd', 'en');
    }

    private handleError(err: HttpErrorResponse) {
        console.log(err);
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
                this.data = NO_DATA;
                this.handleError(error);
            },
        });
    }

    // TODO make sure search is empty or better here
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
}
