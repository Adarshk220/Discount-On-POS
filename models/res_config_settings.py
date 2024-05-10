# -*- coding: utf-8 -*-

from odoo import fields, models


class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    discount_percentage_or_amount = fields.Boolean(string='Discount Percentage or Amount',
                                                   related='pos_config_id.discount_percentage_or_amount', readonly=False)
    discount_type = fields.Selection(selection=[('amount', 'Amount'), ('percentage', 'Percentage')],
                                     string='Discount Type', related='pos_config_id.discount_type', readonly=False,)
