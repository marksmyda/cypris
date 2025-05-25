import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CoreServiceService } from './core-service.service';
import { CoreInterface, Result } from './core-interface';

@Component({
    selector: 'button-demo',
    templateUrl: 'button-demo.html',
    standalone: true,
    imports: [ButtonModule, TableModule]
})
export class ButtonDemo {
    data: CoreInterface = {
        totalHits: 0,
        limit: 0,
        offset: 0,
        results: [],
        searchId: ''
    };

    @Input() query = '';
    @Input() limit = ''; // number checks on this

    constructor(private coreService: CoreServiceService) {}

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
