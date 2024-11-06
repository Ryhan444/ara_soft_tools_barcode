/** @odoo-module **/

import LineComponent from '@stock_barcode/components/line';
import { patch } from "@web/core/utils/patch";
import { onWillStart } from "@odoo/owl";

patch(LineComponent.prototype, {
    setup() {
        super.setup(...arguments);
        onWillStart(async () => {
            const userService = this.env.services.user;
            this.isStockManager = false;
            if (userService && typeof userService.hasGroup === 'function') {
                try {
                    this.isStockManager = await userService.hasGroup('stock.group_stock_manager');
                } catch (error) {
                    this.isStockManager = false;
                }
            } else {
                this.isStockManager = false;
            }
        
        });
    }
});
