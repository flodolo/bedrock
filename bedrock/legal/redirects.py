# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

from bedrock.redirects.util import redirect

redirectpatterns = (
    # bug 1243240
    redirect(r"^about/legal/report-abuse/?$", "legal.report-infringement"),
    # bug 1321033
    redirect(r"^about/legal/terms/firefox-hello", "privacy.archive.hello-2014-11"),
    # issue 5816, issue 8418
    redirect(r"^about/logo", "https://mozilla.design/"),
    # issue 11092, issue 12156
    redirect(r"^about/legal/terms/(mozilla-vpn|vpn)/?$", "legal.terms.subscription-services"),
    # issue 12156
    redirect(r"^about/legal/terms/firefox-relay/?$", "legal.terms.subscription-services"),
    # issue 13272
    redirect(r"^about/legal/terms/firefox-private-network/?$", "privacy.archive.firefox-private-network-tos-2023-06"),
    redirect(r"^about/legal/terms/firefox-reality/?$", "privacy.archive.firefox-reality-tos-2023-06"),
    # issue 14647
    redirect(r"^about/legal/terms/hubs/?$", "privacy.archive.mozilla-hubs-tos-2024-06"),
)
