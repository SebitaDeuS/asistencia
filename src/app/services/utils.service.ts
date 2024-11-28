import { Injectable, inject } from '@angular/core';
import { LoadingController, ToastController  } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  private loading: HTMLIonLoadingElement | null = null;
  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);

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

  // Mostrar un Toast
  async showToast(
    message: string,
    duration: number = 3000,
    color: string = 'success',
    position: 'top' | 'bottom' | 'middle' = 'top'
  ) {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      position,
      color,
    });
    await toast.present();
  }
}