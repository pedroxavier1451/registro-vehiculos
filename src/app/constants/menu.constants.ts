export const MENU_USER = [
  {
    label: 'Operaciones',
    icon: 'pi pi-folder',
    items: [
      { label: 'Formulario', icon: 'pi pi-file', routerLink: ['/formulario'] },
      { label: 'Registro', icon: 'pi pi-list', routerLink: ['/registro'] },
    ]
  },
  {
    label: 'Admin',
    icon: 'pi pi-folder',
    items: [
      { label: 'Validación', icon: 'pi pi-check', routerLink: ['/validacion'] },
      { label: 'Admin', icon: 'pi pi-user', routerLink: ['/admin'] }
    ]
  }
];
