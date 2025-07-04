// voice-input.component.ts
import { Component, NgZone } from '@angular/core';

@Component({
  selector: 'app-voice-input',
  templateUrl: './voice-input.component.html',
  styleUrls: ['./voice-input.component.css']
})
export class VoiceInputComponent {
  micText = '';
  speakerText = '';
  isListening = false;
  currentType: 'mic' | 'speaker' | null = null;
  recognition: any;
  currentTranscript: string = '';

  constructor(private ngZone: NgZone) {}

  async startRecognition(type: 'mic' | 'speaker') {
    if (this.isListening) return;

    const allowed = await this.checkMicType(type);
    if (!allowed) {
      if (type === 'mic') {
        alert('❌ Please connect earphones with mic to use this input.');
        return;
      }
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition not supported in your browser.');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'en-US';
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.currentTranscript = '';
    this.isListening = true;
    this.currentType = type;

    this.recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        this.currentTranscript += event.results[i][0].transcript;
      }
    };

    this.recognition.onend = () => {
      this.ngZone.run(() => {
        if (type === 'mic') {
          this.micText = this.currentTranscript;
        } else if (type === 'speaker') {
          this.speakerText = this.currentTranscript;
        }
        this.isListening = false;
        this.currentType = null;
      });
    };

    this.recognition.onerror = (event: any) => {
      console.error('Recognition error:', event.error);
      this.ngZone.run(() => {
        this.isListening = false;
        this.currentType = null;
      });
    };

    this.recognition.start();
  }

  async checkMicType(type: 'mic' | 'speaker'): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter(device => device.kind === 'audioinput');
      stream.getTracks().forEach(track => track.stop());

      if (type === 'mic') {
        return audioInputs.some(device =>
          /usb|headset|earphone|external/i.test(device.label)
        );
      } else {
        return true; // Always allow speaker input (no alert)
      }
    } catch (err) {
      console.error('Mic detection failed:', err);
      return false;
    }
  }
}
