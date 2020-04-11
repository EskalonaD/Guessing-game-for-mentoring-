import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { StateService } from '../state.service';
import { GameService } from '../game.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    constructor(private state: StateService, private game: GameService) { }

    @Output() private start: EventEmitter<any> = new EventEmitter;

    ngOnInit() {
    }

    get shouldShow(): boolean {
        return !this.state.isStarted;
    }

    startGame(): void {
        this.state.isStarted; // remove
        this.start.emit();
    }
}
