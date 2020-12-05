import { Injectable } from '@angular/core';
declare let alertify: any;


@Injectable({
    providedIn: 'root'
})
export class AlertifyService {
    constructor() {

    }

    confirm(title: string, message: string, okCallback: () => any, cancelCallback: () => any) {

        alertify.confirm( title , message, function(e) {
            if (e) {
                okCallback();
            } else {}
        },
        function(e) {
            if (e) {
                cancelCallback();
            } else {}
        });
    }

    success(message: string) {
        alertify.set('notifier', 'position', 'top-right');
        alertify.success(message);
    }
    error(message: string) {
        alertify.set('notifier', 'position', 'top-right');
        alertify.error(message);
    }
    warning(message: string) {
        alertify.set('notifier', 'position', 'top-right');
        alertify.warning(message);
    }
    message(message: string) {
        alertify.set('notifier', 'position', 'top-right');
        alertify.message(message);
    }


}
