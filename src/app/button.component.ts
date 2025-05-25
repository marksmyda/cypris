import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

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
}
