# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

from textwrap import dedent

from bedrock.mozorg.tests import TestCase
from bedrock.sitemaps.models import NO_LOCALE, SitemapURL


class TestSitemapView(TestCase):
    def setUp(self):
        data = [
            {"path": "/firefox/all/", "locale": "de"},
            {"path": "/firefox/", "locale": "de"},
            {
                "path": "/privacy/",
                "locale": "fr",
            },
            {"path": "/firefox/", "locale": "fr"},
            {"path": "/keymaster/gatekeeper/there.is.only.xul", "locale": NO_LOCALE},
            {
                "path": "/locales/",
                "locale": NO_LOCALE,
            },
        ]
        SitemapURL.objects.bulk_create(SitemapURL(**kw) for kw in data)

    def test_index(self):
        good_resp = dedent(
            """\
            <?xml version="1.0" encoding="UTF-8"?>
            <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
              <sitemap>
                <loc>https://www.mozilla.org/all-urls-global.xml</loc>
              </sitemap>
              <sitemap>
                <loc>https://www.mozilla.org/de/all-urls.xml</loc>
              </sitemap>
              <sitemap>
                <loc>https://www.mozilla.org/fr/all-urls.xml</loc>
              </sitemap>
            </sitemapindex>"""
        )
        resp = self.client.get("/all-urls.xml")
        assert resp.text == good_resp

    def test_none(self):
        good_resp = dedent(
            """\
            <?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
              <url>
                <loc>https://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul</loc>
              </url>
              <url>
                <loc>https://www.mozilla.org/locales/</loc>
              </url>
            </urlset>"""
        )
        resp = self.client.get("/all-urls-global.xml")
        assert resp.text == good_resp

    def test_locales(self):
        good_resp = dedent(
            """\
            <?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
              <url>
                <loc>https://www.mozilla.org/de/firefox/</loc>
              </url>
              <url>
                <loc>https://www.mozilla.org/de/firefox/all/</loc>
              </url>
            </urlset>"""
        )
        resp = self.client.get("/de/all-urls.xml")
        assert resp.text == good_resp

        good_resp = dedent(
            """\
            <?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
              <url>
                <loc>https://www.mozilla.org/fr/firefox/</loc>
              </url>
              <url>
                <loc>https://www.mozilla.org/fr/privacy/</loc>
              </url>
            </urlset>"""
        )
        resp = self.client.get("/fr/all-urls.xml")
        assert resp.text == good_resp

    def test_post(self):
        resp = self.client.post("/en-US/all-urls.xml")
        assert resp.status_code == 405
