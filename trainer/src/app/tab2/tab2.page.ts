import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  constructor(private photoService: PhotoService) {
    
  }

  async ngOnInit() {

    
    const video = document.getElementById('webcam') as HTMLVideoElement;
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      video.srcObject = stream;
      await video.play();
    } catch (error) {
      console.error('Erro ao acessar a câmera:', error);
    }
  }

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }


}
