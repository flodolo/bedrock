# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

# Generated by Django 4.2.11 on 2024-05-08 15:55

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("contentful", "0007_data_switch_to_local_images"),
    ]

    operations = [
        migrations.AlterField(
            model_name="contentfulentry",
            name="content_type",
            field=models.CharField(max_length=32),
        ),
        migrations.AlterField(
            model_name="contentfulentry",
            name="contentful_id",
            field=models.CharField(max_length=32),
        ),
        migrations.AlterField(
            model_name="contentfulentry",
            name="locale",
            field=models.CharField(max_length=24),
        ),
    ]
