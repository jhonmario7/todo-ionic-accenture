import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ModalController } from '@ionic/angular';
import { CategoriesService } from '../../core/services/categories.service';
import { Category } from '../../core/models/category.model';
import { CategoryFormComponent } from '../../modals/category-form/category-form.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class CategoriesPage implements OnInit {
  categories: Category[] = [];

  constructor(
    private categoriesService: CategoriesService,
    private modalController: ModalController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.categoriesService.categories$.subscribe(categories => {
      this.categories = categories;
    });
  }

  /* Abrir modal para agregar categoría */
  async addCategoryPrompt() {
    const modal = await this.modalController.create({
      component: CategoryFormComponent,
      componentProps: {
        isEdit: false
      }
    });

    await modal.present(); 

    const { data, role } = await modal.onWillDismiss();
    
    if (role === 'confirm' && data) {
      await this.categoriesService.addCategory(data.name, data.color);
    }
  }

  /* Abrir modal para editar categoría */
  async editCategoryPrompt(category: Category) {
    const modal = await this.modalController.create({
      component: CategoryFormComponent,
      componentProps: {
        category: category,
        isEdit: true
      }
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    
    if (role === 'confirm' && data) {
      const updated: Category = {
        ...category,
        name: data.name,
        color: data.color
      };
      await this.categoriesService.updateCategory(updated);
    }
  }

  /* Eliminar categoría */
  async deleteCategoryPrompt(category: Category) {
    const alert = await this.alertController.create({
      header: 'ELIMINAR CATEGORÍA',
      message: `¿Estás seguro de eliminar "${category.name}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.categoriesService.deleteCategory(category.id);
          }
        }
      ]
    });

    await alert.present();
  }

  trackByCategoryId(index: number, category: Category): string {
    return category.id;
  }
}
