# -*- coding: utf-8 -*-

from odoo import fields, models


class PosConfig(models.Model):
    _inherit = 'pos.config'

    discount_percentage_or_amount = fields.Boolean(string='Discount Percentage or Amount')
    discount_type = fields.Selection(selection=[('amount', 'Amount'), ('percentage', 'Percentage')],
                                     string='Discount Type')
