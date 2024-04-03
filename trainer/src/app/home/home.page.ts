import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.loadApp();
  }
  async loadApp(){
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
    });
    loading.present();
    const {HomePageModule} = await import('./home.module');
    loading.dismiss(); 
  }
}
