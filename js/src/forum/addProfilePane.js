import { extend } from 'flarum/common/extend';
import app from 'flarum/forum/app';
import LinkButton from 'flarum/common/components/LinkButton';
import UserPage from 'flarum/forum/components/UserPage';
import ProfileConfigurePane from './panes/ProfileConfigurePane';
import ProfilePane from './panes/ProfilePane';

export default function () {
    // The configure route must be registered first because otherwise there's a conflict between the two routes
    app.routes['fof-masquerade-configure-profile'] = {
        path: '/masquerade/configure',
        component: ProfileConfigurePane,
    };
    app.routes['fof-masquerade-view-profile'] = {
        path: '/masquerade/:username',
        component: ProfilePane,
    };

    extend(UserPage.prototype, 'navItems', function (items) {
        const isOwnProfileAndCanHaveMasquerade = app.forum.attribute('canHaveMasquerade') && app.session.user.id() === this.user.id();

        if (app.forum.attribute('canViewMasquerade') || isOwnProfileAndCanHaveMasquerade) {
            const href = isOwnProfileAndCanHaveMasquerade
                ? app.route('fof-masquerade-configure-profile')
                : app.route('fof-masquerade-view-profile', { username: this.user.username() });
            items.add(
                'masquerade',
                LinkButton.component(
                    {
                        href,
                        icon: 'far fa-id-card',
                    },
                    app.translator.trans('fof-masquerade.forum.buttons.view-profile')
                ),
                200
            );
        }
    });
}
