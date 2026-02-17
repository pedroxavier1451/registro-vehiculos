export const MENU_USER = [
  {
    label: 'Nosotros',
    items: [
      { label: 'Monasterio', routerLink: ['/'] },
      { label: 'Quienes Somos', routerLink: ['/'] },
    ]
  },
  {
    label: 'Espiritualidad',
    items: [
      { label: 'Virgen del Carmen', routerLink: ['/'] },
      { label: 'Niño Viajero', routerLink: ['/'] },
      { label: 'Santuario', routerLink: ['/'] },
      { label: 'Grupo Hermano Miguel', routerLink: ['/'] },
    ]
  },
  {
    label: 'Productos',
    items: [
      { label: 'Producto 1', routerLink: ['/'] },
    ]
  },
  {
    label: 'Eventos',
    items: [
      { label: 'Pase del niño viajero', routerLink: ['/formulario'] },
    ]
  },
  {
    label: 'Iniciar sesión',
    icon: 'pi pi-user',
    routerLink: ['/admin'],
    styleClass: 'login-button'
  }
];
