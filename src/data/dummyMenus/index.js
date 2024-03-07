import React from 'react';
import {
  IconEditProfile,
  IconUlasan,
  IconChangePassword,
  IconTentangKami,
  IconSignOut,
} from '../../assets';

export const dummyMenus = [
  {
    id: 1,
    nama: 'Edit Profile',
    gambar: <IconEditProfile />,
    halaman: 'EditProfile',
  },
  {
    id: 2,
    nama: 'Ulasan',
    gambar: <IconUlasan />,
    halaman: 'Ulasan',
  },
  {
    id: 3,
    nama: 'Ganti Password',
    gambar: <IconChangePassword />,
    halaman: 'ChangePassword',
  },
  {
    id: 4,
    nama: 'Tentang Kami',
    gambar: <IconTentangKami />,
    halaman: 'TentangKami',
  },
  {
    id: 5,
    nama: 'Keluar',
    gambar: <IconSignOut />,
    halaman: 'Login',
  },
];
