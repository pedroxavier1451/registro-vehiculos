import { Component, OnInit } from '@angular/core';
import { CAROUSEL_IMAGES } from '../../config/carousel-images.config';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  images: any[] = [];
  responsiveOptions: any[] = [];

  ngOnInit() {
    this.loadCarouselImages();
    this.setupResponsiveOptions();
  }

  /**
   * Carga las imágenes directamente desde la configuración
   */
  private loadCarouselImages() {
    this.images = CAROUSEL_IMAGES.map((filename, index) => ({
      itemImageSrc: `assets/images/carousel/${filename}`,
      thumbnailImageSrc: `assets/images/carousel/${filename}`,
      alt: `Imagen ${index + 1}`,
      title: this.getImageTitle(filename, index)
    }));
  }

  /**
   * Genera un título descriptivo basado en el nombre del archivo
   */
  private getImageTitle(filename: string, index: number): string {
    const nameWithoutExt = filename.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '');
    const title = nameWithoutExt
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
    
    return title || `Imagen ${index + 1}`;
  }

  /**
   * Configura las opciones responsivas del carrusel
   */
  private setupResponsiveOptions() {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 5
      },
      {
        breakpoint: '768px',
        numVisible: 3
      },
      {
        breakpoint: '560px',
        numVisible: 1
      }
    ];
  }
}
