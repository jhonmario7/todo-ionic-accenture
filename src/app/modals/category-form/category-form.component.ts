import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class CategoryFormComponent implements OnInit {
  @Input() category?: Category;
  @Input() isEdit: boolean = false;

  categoryName: string = '';
  categoryColor: string = '#3880ff';

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    if (this.category) {
      this.categoryName = this.category.name;
      this.categoryColor = this.category.color || '#3880ff';
    }
  }

  /**
   * @method dismiss
   * @funcionalidad Se encarga de cerrar el modal
   */
  dismiss() {
    this.modalController.dismiss(null, 'cancel');
  }

  /**
   * @method save
   * @funcionalidad Se encarga de guardar la categoría
   */
  save() {
    if (this.categoryName.trim().length > 0) {
      this.modalController.dismiss({
        name: this.categoryName.trim(),
        color: this.categoryColor
      }, 'confirm');
    }
  }

  /**
   * @method getContrastColor
   * @funcionalidad Se encarga de calcular el color de texto contrastante para la vista previa
   * @param hexColor - El color hexadecimal
   * @returns string
   */
  getContrastColor(hexColor: string): string {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  }
}