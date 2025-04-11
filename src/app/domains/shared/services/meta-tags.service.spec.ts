import { Meta, Title } from '@angular/platform-browser';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MetaTagsService } from './meta-tags.service';

describe('MetaTagsService', () => {
  let spectator: SpectatorService<MetaTagsService>;
  let metaPlatform: Meta;
  let titlePlatform: Title;
  const createServices = createServiceFactory({
    service: MetaTagsService,
    providers: [
      {
        provide: Title,
        useValue: {
          setTitle: jest.fn(), // Mock implementation of setTitle
        },
      },
      {
        provide: Meta,
        useValue: {
          updateTag: jest.fn(), // Mock implementation of updateTag
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createServices();
    metaPlatform = spectator.inject(Meta);
    titlePlatform = spectator.inject(Title);
  });
  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should update meta tags with default values', () => {
    const metaData = {
      title: 'Test Title',
      description: 'Test Description',
      image: 'test-image.jpg',
      url: 'https://example.com',
    };

    spectator.service.updateMetaTags(metaData);

    expect(metaPlatform.updateTag).toHaveBeenCalledTimes(6);
    expect(titlePlatform.setTitle).toHaveBeenCalledTimes(1);
    expect(spectator.inject(Title).setTitle).toHaveBeenCalledWith(
      metaData.title
    );
    expect(spectator.inject(Meta).updateTag).toHaveBeenCalledWith({
      name: 'title',
      content: metaData.title,
    });
    expect(spectator.inject(Meta).updateTag).toHaveBeenCalledWith({
      name: 'description',
      content: metaData.description,
    });
  });
});
