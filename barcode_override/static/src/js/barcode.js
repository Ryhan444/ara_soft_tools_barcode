/** @odoo-module **/
import BarcodeQuantModel from '@stock_barcode/models/barcode_quant_model';
import { _t } from "@web/core/l10n/translation";
import { patch } from "@web/core/utils/patch";

patch(BarcodeQuantModel.prototype,{
    setup() {
        this._super(...arguments);
    },
    async _updateLineQty(line, args) {
        // Simpan kuantitas sebelum memulai
        await this.save();

        const domain = [
            ['location_id', '=', line.location_id.id],
            ['product_id', '=', line.product_id.id],
        ];
        const res = await this.orm.call('stock.quant', 'get_existing_quant_and_related_data', [domain]);
        
        this.cache.setCache(res.records);
        const quants = res.records['stock.quant'];

        // Jika ada quants yang sesuai, atur inventory_quantity awal berdasarkan quant terakhir
        if (quants && quants.length > 0) {
            line.inventory_quantity = quants[0].inventory_quantity; // Ambil nilai dari quant terakhir
        } else {
            // Jika tidak ada quant, inisialisasi inventory_quantity ke 0
            line.inventory_quantity = 0;
        }

        // Hanya set stock quantity jika ada args.quantity
        if (args.quantity) {
            line.quantity = args.quantity;
        }
        
        // Jika ada inventory_quantity yang dilewatkan
        if (args.inventory_quantity) {
            if (args.uom) {
                const productUOM = this.cache.getRecord('uom.uom', line.product_id.uom_id);
                if (args.uom.category_id !== productUOM.category_id) {
                    const message = _t(
                        "Scanned quantity uses %s as Unit of Measure, but this UoM is not compatible with the product's one (%s).",
                        args.uom.name,
                        productUOM.name
                    );
                    return this.notification(message, { title: _t("Wrong Unit of Measure"), type: "warning" });
                } else if (args.uom.id !== productUOM.id) {
                    args.inventory_quantity = (args.inventory_quantity / args.uom.factor) * productUOM.factor;
                }
            }

            // Tambah kuantitas berdasarkan args.inventory_quantity
            line.inventory_quantity += args.inventory_quantity;
            line.inventory_quantity_set = true;

            // Batasan jika product_id tracking serial number
            if (line.product_id.tracking === 'serial' && (line.lot_name || line.lot_id)) {
                line.inventory_quantity = Math.max(0, Math.min(1, line.inventory_quantity));
            }

        }

        // Refresh data dari cache setelah update kuantitas untuk memastikan sinkronisasi
        await this.save();  // Simpan data setelah semua proses selesai
        // window.location.reload();
        // this.trigger('update');
        await this.trigger('update');

    }
})



