import { Routes } from '@angular/router';
import { AddBookComponent } from './library/components/add-book/add-book.component';
import { DelBookComponent } from './library/components/del-book/del-book.component';
import { UpdateBookComponent } from './library/components/update-book/update-book.component';
import { SearchBooksComponent } from './library/components/search-books/search-books.component';
import { SearchIdBookComponent } from './library/components/search-id-book/search-id-book.component';
import { LoginComponent } from './library/components/login/login.component';
import { RegisterComponent } from './library/components/register/register.component';
import { authGuard } from './library/guards/auth.guard';
import { LandingComponent } from './library/components/landing/landing.component';
import { CommunityComponent } from './library/components/community/community.component';

export const routes: Routes = [

    {
    path: 'landing',
    component: LandingComponent
    },

    {
        path:'community',
        component:CommunityComponent,
    },

    {
        path:'login',
        component: LoginComponent
    },

    {
        path: 'register',
        component: RegisterComponent
    },

    {
        path:'addbook',
        component: AddBookComponent,
        canActivate: [authGuard]
    },
    {
        path:'deletebook/:id',
        component: DelBookComponent,
        canActivate: [authGuard]
    },
    {
        path:'deletebook',
        component: DelBookComponent,
        canActivate: [authGuard]
    },
    {
        path:'updatebook/:id',
        component:UpdateBookComponent,
        canActivate: [authGuard]
    },
    {
        path:'updatebook',
        component:UpdateBookComponent,
        canActivate: [authGuard]
    },
    {
        path:'searchBook',
        component:SearchIdBookComponent,
        canActivate: [authGuard]
    }
    ,
    {
        path:'home',
        component:SearchBooksComponent,
        canActivate: [authGuard]
    },
    {
        path:'',
        redirectTo:'landing',
        pathMatch:'full'
    }
];
