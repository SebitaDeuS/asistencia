import { Injectable, inject } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  private loading: HTMLIonLoadingElement | null = null;
  loadingCtrl = inject(LoadingController);

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      spinner: 'crescent',
      message: 'Cargando...',
      backdropDismiss: false
    });
    await this.loading.present();
  }

  async hideLoading() {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }
}