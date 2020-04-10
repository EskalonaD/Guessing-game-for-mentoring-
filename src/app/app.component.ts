import { Component, ViewChild, ElementRef, Renderer2, AfterViewInit, OnDestroy, ComponentFactoryResolver } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { StateService } from './state.service';
import { takeUntil } from 'rxjs/operators';
import { Subscription, Subject } from 'rxjs';
import { GameAnchorDirective } from './game-anchor.directive';
import { MainComponent } from './main/main.component';
import { GameService } from './game.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit, OnDestroy {
    title = 'game2';

    @ViewChild('contentContainer', { static: false }) contentContainer: ElementRef;
    @ViewChild('wrapper', { static: false }) wrapper: ElementRef;
    @ViewChild(GameAnchorDirective, { static: true }) gameContainer: GameAnchorDirective; //check why static true;

    private unsubscriber$: Subject<any> = new Subject();
    private GameComponent = MainComponent;// rename
    showScrollButtons: boolean = false;
    topScroll: boolean = false;
    bottomScroll: boolean = false; 
    timeout: any;
    scrollButtonUpdaterOnMessegeCreation$: Subscription = this.state.chat$.pipe(
        takeUntil(this.unsubscriber$),
    ).subscribe(_ => this.onScroll());
    

    constructor(private state: StateService, private renderer: Renderer2, private resolver: ComponentFactoryResolver, private game: GameService) { }

    ngAfterViewInit() {
        const onScroll = this.renderer.listen(this.wrapper.nativeElement, 'scroll', () => {
            this.showScrollButtons = true;
            onScroll();
        });
    }

    ngOnDestroy() {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    // get gameStarted(): boolean {
    //     console.log('isStarted', this.state.isStarted)
    //     return this.state.isStarted;
    // }

    onScroll(): void {
        if (this.showScrollButtons) {
            if (this.wrapper.nativeElement.scrollTop > 50) {
                this.topScroll = true;
            }

            if (this.wrapper.nativeElement.scrollTop < 50) {
                this.topScroll = false;
            }

            if (!this.timeout) {
                this.timeout = setTimeout(() => {
                    if (this.wrapper.nativeElement.scrollTop < this.wrapper.nativeElement.scrollHeight - this.wrapper.nativeElement.clientHeight - 20) {
                        this.bottomScroll = true;
                    }
                    if (this.wrapper.nativeElement.scrollTop === this.wrapper.nativeElement.scrollHeight - this.wrapper.nativeElement.clientHeight) {
                        this.bottomScroll = false;
                    }
                    this.timeout = false;
                }, 800)    //update time amount, set animation to 'hide' freezes?!
            }
        }
    }

    startGame() {
        this.state.isEnded = false;
        // change variables names;
        const componentFactory = this.resolver.resolveComponentFactory(this.GameComponent);
        const viewContainerRef = this.gameContainer.viewRef; // check what exactly is viewContainerRef and another Refs;
        const componentRef = viewContainerRef.createComponent(componentFactory);
        this.state.gamesStorage.push(componentRef);
    }

    endGame() {
        // could be replaced with ng-container with ngIf directive... but leave it as is for learning purpose;
        this.game.destroyExistingGames();
    }

    scrollTo(way: string): void {
        if (way === 'top') {
            this.state.shouldScroll = false;
            this.contentContainer.nativeElement.scrollIntoView({ block: 'start', behavior: 'smooth' })
        }

        if (way === 'bottom') {
            this.state.shouldScroll = true;
            this.contentContainer.nativeElement.scrollIntoView({ block: 'end', behavior: 'smooth' });
        }
    }
}
