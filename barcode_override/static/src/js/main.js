/** @odoo-module **/
import Main from '@stock_barcode/components/main';
import { _t } from "@web/core/l10n/translation";
import { patch } from "@web/core/utils/patch";
import { onWillStart } from "@odoo/owl";

patch(Main.prototype,{
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