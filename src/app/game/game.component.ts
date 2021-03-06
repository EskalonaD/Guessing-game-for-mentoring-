import {
    Component,
    OnInit,
    OnDestroy,
} from '@angular/core';
import { StateService } from '@project/state.service';
import { GameService } from '@project/game.service';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { scan, takeUntil, delay } from 'rxjs/operators';
import { Message } from '@project/models';


@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
    constructor(
        private state: StateService,
        private game: GameService,
        ) { }

    private unsubscriber$: Subject<void> = new Subject;

    input: FormControl;
    showDivider: boolean;
    shouldScroll: boolean;
    incorrectInput: boolean;
    messages$: Observable<Message[]>;

    ngOnInit() {
        this.shouldScroll = true;
        this.incorrectInput = false;
        this.showDivider = false;
        this.input = new FormControl('');
        this.messages$ = this.game.chatListener$.pipe(
            takeUntil(this.unsubscriber$),
            scan((acc: Message[], val: Message) => {
                acc.push(val);
                return acc;
            }, []),
        );

        this.state.isEnded$.pipe(
            takeUntil(this.unsubscriber$),
            delay(1800)
        ).subscribe(() => {
                this.showDivider = true;
                this.unsubscriber$.next();
                this.unsubscriber$.complete();
        });

        this.state.messageShouldScroll$.pipe(
            takeUntil(this.unsubscriber$),
        ).subscribe(x => this.shouldScroll = x);

        this.state.messageShouldScroll$.next(true);
    }

    ngOnDestroy() {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    handleInput(): void {
        if (!this.shouldHandleInput()) return;

        const { value } = this.input;

        if (value === +value) {
            this.incorrectInput = false;

            this.game.setGameParameters(+value);
            this.input.disable();
        }
        else {
            this.incorrectInput = true;

            this.input.setValue(null);
        }
    }

    private shouldHandleInput(): boolean {
        return !this.input.disabled;
    }

    onInputKeyDown(event: KeyboardEvent): void {
        event.stopPropagation();
        const key = event.key || event.keyCode;

        switch (key) {
            case 'Enter':
            case 13:
                this.handleInput();
                break;
            case 'Escape':
            case 27:
                this.input.setValue(null);
                break;
        }
    }
}
