import { Injectable } from '@angular/core';
import { Content } from '../Models/content.interface';
import { delay, Observable, of } from 'rxjs';
import { ContentStatus } from '../Models/common.enum';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor() {}
  public getFeaturedProducts(): Observable<Content[]> {
    // Simulate an API call with a Promise
    const products: Content[] = [
      {
        id: 1,
        contentType: 'Article',
        ownerId: 10,
        content: {
          id: 1,
          ownerId: 10,
          title: 'Understanding Angular Services',
          author: 'John Doe',
          body: 'This article explains how Angular services work.',
          imageUrl: 'https://via.placeholder.com/150',
        },
        description: 'Article about Angular Services',
        contentStatus: ContentStatus.Published,
      },
      {
        id: 2,
        contentType: 'Segment',
        ownerId: 11,
        content: {
          id: 1,
          ownerId: 11,
          name: 'TypeScript Basics',
          host: 'John Doe',
          contents: [],
        },
        description: 'Segment on TypeScript Basics',
        contentStatus: ContentStatus.Review,
      },
      {
        id: 3,
        contentType: 'Episode',
        ownerId: 12,
        content: {
          id: 1,
          ownerId: 12,
          title: 'Getting Started with Angular',
          host: 'John Doe',
          airDate: new Date(),
          segments: [],
        },
        description: 'Episode on Angular Components',
        contentStatus: ContentStatus.Draft,
      },
    ];
    return of(products).pipe(delay(2000)); // Simulate 2 seconds delay
  }

  public assignOwnerToProduct(content: Content, ownerId: number): Content {
    content.ownerId = ownerId;
    return content;
  }

  public updateContentStatus(content: Content, status: ContentStatus): Content {
    content.contentStatus = status;
    return content;
  }
}
