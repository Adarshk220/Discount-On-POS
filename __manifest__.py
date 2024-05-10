{
    'name': 'Discount On POS',
    'author': 'Adarsh',
    'version': '17.0.1.0.0',
    'summary': 'Discount On POS',
    'depends': ['base', 'point_of_sale'],
    'data': [
        'views/res_config_settings_views.xml',
    ],
    'sequence': -112,
    'application': True,
'assets': {
        'point_of_sale._assets_pos': [
            'discount_on_pos/static/src/js/discount_button.js',
            'discount_on_pos/static/src/xml/discount_button.xml',
        ],
    },
}
