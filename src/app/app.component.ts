import { Component, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { StateService } from './state.service';
import { takeUntil } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {
    title = 'game2';

    @ViewChild('contentContainer', { static: false }) contentContainer: ElementRef;
    @ViewChild('wrapper', { static: false }) wrapper: ElementRef;

    showScrollButtons: boolean = false;
    topScroll: boolean = false;
    bottomScroll: boolean = false; 
    timeout: any;
    scrollButtonUpdaterOnMessegeCreation$: Subscription = this.state.chat$.pipe(
        takeUntil(this.state.unsubscriber$),
    ).subscribe(_ => this.onScroll());

    constructor(private state: StateService, private renderer: Renderer2) { }

    ngAfterViewInit() {
        const onScroll = this.renderer.listen(this.wrapper.nativeElement, 'scroll', () => {
            this.showScrollButtons = true;
            onScroll();
        });
    }

    onScroll(): void {
        if (this.showScrollButtons) {
            if (this.wrapper.nativeElement.scrollTop > 100) {
                this.topScroll = true;
            }

            if (this.wrapper.nativeElement.scrollTop < 100) {
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
                }, 1000)
            }
        }
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
