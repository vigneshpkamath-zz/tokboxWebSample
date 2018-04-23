import { Component, OnInit, NgZone } from '@angular/core';

declare const OT: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'Opentok';
  apiKey = '';
  token = '';
  sessionId = '';

	subscriber: any;
	session: any;
	isStreaming: boolean;
	stream: any;

	constructor(private ngZone: NgZone) {}

  subscribeAuction() {
		let container = document.getElementById('stream-container');
		this.session = OT.initSession(this.apiKey, this.sessionId);

		this.session.connect(this.token, (status: any) => {
			console.log('Session connected')

			if (status) {
				console.log('AWA - Session Failed : ', status);
			} else {
				this.session.on('streamCreated', (event: any) => {
					console.log('stream Created')

					let videoDiv = document.createElement('div');
					videoDiv.id = 'subscriberContainer';
					container.appendChild(videoDiv);
					this.ngZone.run(() => {
						this.isStreaming = true;
					});

					let subscriberOption = {
						inserMode : 'append',
						width: '100%',
						height: '480px',
						fitMode: 'cover',
						style: { nameDisplayMode: 'off' },
					}

					this.subscriber = this.session.subscribe(event.stream, 'subscriberContainer', subscriberOption, (error: any) => {
						if (error) {
							console.log('AWA - Subscriber Failed : ', error);
						} else {
							console.log('subscriber connected')
							this.stream = event.stream;
							this.ngZone.run(() => {
								this.isStreaming = true;
							});
						}
					});

					this.subscriber.setStyle('backgroundImageURI', 'https://anywhere-staging.s3.amazonaws.com/property_images/67f9ee2a-4721-4d67-b516-5ae3a939db50.jpeg');
				});

				this.session.on('streamDestroyed', (event: any) => {
					console.log('Event : stream Destroyed')
					this.ngZone.run(() => {
						this.isStreaming = false;
					});
				});
			}
		});

		this.session.on('sessionDisconnected', (event: any) => {
			console.log('Event : session Disconnected')
			this.ngZone.run(() => {
				this.isStreaming = false;
			});
		});
	}

	ngOnInit() {
		this.subscribeAuction();
	}
}
