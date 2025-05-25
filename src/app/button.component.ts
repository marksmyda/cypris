import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CoreServiceService } from './core-service.service';
import { CoreInterface } from './core-interface';

@Component({
    selector: 'button-demo',
    templateUrl: 'button-demo.html',
    standalone: true,
    imports: [ButtonModule, TableModule]
})
export class ButtonDemo {
    products = [
        { code: 'P101', name: 'Product 1', category: 'Electronics', quantity: 10 },
        { code: 'P102', name: 'Product 2', category: 'Clothing', quantity: 20 }
    ];

    data: CoreInterface | undefined;

    constructor(private coreService: CoreServiceService) {}

    fetch() {
        this.coreService.getCoreData('(drone)').subscribe((data) => {
            this.data = data;
            console.log(this.data);
        });
    }
}
