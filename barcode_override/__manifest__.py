# -*- coding: utf-8 -*-
{
    "name": "Barcode Stock Setup Access Component ",
    "summary": """Add extra override in adjusments via barcode""",
    "description": """
        Add extra quantity stock.quant in adjusments only next scan only one user login. And feature setup access component button on barcode_stock.
          """,
    "author": "ARA SOFTWARE PRODUCTIONS",
    "website": "",
    "category": "Point of Sale",
    "version": "17.0.0.0.0",
    "depends": [
        "stock",
    ],
    "data": [
    ],
    "assets": {
        'web.assets_backend': [
            'barcode_override/static/src/js/barcode.js',
            'barcode_override/static/src/js/line.js',
            'barcode_override/static/src/xml/line_override.xml',
            'barcode_override/static/src/js/main.js',
        ],
    },
    "installable": True,
    "auto_install": False,
    "application": False,
    "images": ["static/description/icon.png"],
    "demo": [],
    "license": "OEEL-1",
}
