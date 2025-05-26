import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CoreServiceService } from './core-service.service';
import { CoreInterface, Result } from './core-interface';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChartModule } from 'primeng/chart';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { formatDate } from '@angular/common';
import { SortEvent } from 'primeng/api';

import moment from 'moment';

@Component({
    selector: 'button-demo',
    templateUrl: 'button-demo.html',
    standalone: true,
    imports: [ButtonModule, TableModule, ReactiveFormsModule, ChartModule, ProgressSpinnerModule]
})
export class ButtonDemo {

    numericControl = new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$')
    ]);

    data: CoreInterface = {
        totalHits: 0,
        limit: 0,
        offset: 0,
        results: [],
        searchId: ''
    };

    fieldData = {
        labels: ["A", "B", "C"],
        datasets: [
            {
                data: [150, 50, 100],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
            }
        ]
    };

    @Input() query = ''; // is this how to use @Input?
    @Input() limit = ''; // number checks on this

    constructor(private coreService: CoreServiceService) {}

    private subscription: Subscription | null = null;

    ngOnInit() {
        this.subscription = this.numericControl.valueChanges.subscribe(value => {
            const sanitized = (value ?? '').replace(/\D/g, ''); // remove all non-digits
            if (sanitized !== value) {
                this.numericControl.setValue(sanitized, { emitEvent: false });
            }
        });
    }
    
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    fetch() {
        this.coreService.getCoreData(this.query, this.limit).subscribe({
            next: (data) => {
                this.data = data;
            },
            error: (error) => {
                console.log('Problem contacting service: ', error);
                throw new Error('Failed to fetch Core data.');
            }
        });
    }

    getAuthorNames(result: Result): string {
        return result.authors.map(author => author.name).join(', ');
    }

    getDateFromString(result: Result): string {
        return formatDate(new Date(result.publishedDate), 'yyyy MMM dd', 'en');
    }

    onQueryChange(event: Event) {
        const target = event.target as HTMLInputElement;
        this.query = target.value;
    }

    onLimitChange(event: Event) {
        const target = event.target as HTMLInputElement;
        this.limit = target.value;
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

      customSort(event: SortEvent) {
        if (event.data) {
            if (event.field === 'getDateFromString') {
                event.data.sort((a, b) => {
                    const dateA = moment(this.getDateFromString(a), 'yyyy MMM dd');
                    const dateB = moment(this.getDateFromString(b), 'yyyy MMM dd');

                    if (dateA.isBefore(dateB)) {
                        return event.order === 1 ? -1 : 1;
                    } else if (dateA.isAfter(dateB)) {
                        return event.order === 1 ? 1 : -1;
                    } else {
                        return 0;
                    }
                });
            } else {
                event.data.sort((a, b) => {
                    let field = event.field ?? '';
                    const valueA = a[field];
                    const valueB = b[field];

                    if (valueA < valueB) {
                        return event.order === 1 ? -1 : 1;
                    } else if (valueA > valueB) {
                        return event.order === 1 ? 1 : -1;
                    } else {
                        return 0;
                    }
                });
            }
        }
    }

}
