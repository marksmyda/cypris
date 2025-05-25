import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CoreServiceService } from './core-service.service';
import { CoreInterface, Result } from './core-interface';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChartModule } from 'primeng/chart';

@Component({
    selector: 'button-demo',
    templateUrl: 'button-demo.html',
    standalone: true,
    imports: [ButtonModule, TableModule, ReactiveFormsModule, ChartModule]
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
                console.log(this.data);
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

    onQueryChange(event: Event) {
        const target = event.target as HTMLInputElement;
        this.query = target.value;
    }

    onLimitChange(event: Event) {
        const target = event.target as HTMLInputElement;
        this.limit = target.value;
    }

}
