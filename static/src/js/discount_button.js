/**@odoo-module **/
import { usePos } from "@point_of_sale/app/store/pos_hook";
import { useService } from "@web/core/utils/hooks";
import { _t } from "@web/core/l10n/translation";
import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { TextAreaPopup } from "@point_of_sale/app/utils/input_popups/textarea_popup";
import { Component } from "@odoo/owl";

export class DiscountButton extends Component {
    static template = "point_of_sale.DiscountButton";

    setup() {
        this.pos = usePos();
        this.popup = useService("popup");
    }
    async _onDiscountClick() {
        var self = this;
        const selectedOrderline = this.pos.get_order().get_selected_orderline();
        if (!selectedOrderline) {
            return;
        }

        const { confirmed, payload: inputDiscount } = await this.popup.add(TextAreaPopup, {
            startingValue: this.pos.config.discount_pc,
            title: _t("Add Discount"),
            isInputSelected: true,
        });
        console.log('hi')

        if (confirmed) {
            selectedOrderline.get_discount(inputDiscount);
            await self.apply_discount(inputDiscount);
        }
    }
    async apply_discount(pc) {
        const order = this.pos.get_order();
        const lines = order.get_orderlines();
        const product = this.pos.db.get_product_by_id(this.pos.config.discount_product_id[0]);
        if (product === undefined) {
            await this.popup.add(ErrorPopup, {
                title: _t("No discount product found"),
                body: _t(
                    "The discount product seems misconfigured. Make sure it is flagged as 'Can be Sold' and 'Available in Point of Sale'."
                ),
            });
            return;
        }
         // Remove existing discounts
        lines
            .filter((line) => line.get_product() === product)
            .forEach((line) => order._unlinkOrderline(line));
        const discount_type = this.pos.config.discount_type
        if (discount_type === 'amount') {
            const discount_amount = -pc;
            if (discount_amount < 0) {
                order.add_product(product, {
                    price: discount_amount,
                    lst_price: discount_amount,
                    extras: {
                        price_type: "automatic",
                    },
                });
            }
        }
        else {
            const linesByTax = order.get_orderlines_grouped_by_tax_ids();
            for (const [tax_ids, lines] of Object.entries(linesByTax)) {
                // Note that tax_ids_array is an Array of tax_ids that apply to these lines
                // That is, the use case of products with more than one tax is supported.
                const tax_ids_array = tax_ids
                    .split(",")
                    .filter((id) => id !== "")
                    .map((id) => Number(id));

                const baseToDiscount = order.calculate_base_amount(
                    tax_ids_array,
                    lines.filter((ll) => ll.isGlobalDiscountApplicable())
                );
                const discount = (-pc / 100.0) * baseToDiscount;
                if (discount < 0) {
                    order.add_product(product, {
                        price: discount,
                        lst_price: discount,
                        tax_ids: tax_ids_array,
                        merge: false,
                        extras: {
                            price_type: "automatic",
                        },
                    });
                }
            }

        }

    }
}

ProductScreen.addControlButton({
    component: DiscountButton,
    condition: function () {
        return true;
    },
});