import { Meta, Title } from '@angular/platform-browser';
import { environment } from '@env/environment';
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

    // Reset mocks between tests
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should update meta tags with full metadata values', () => {
    const metaData = {
      title: 'Test Title',
      description: 'Test Description',
      image: 'test-image.jpg',
      url: 'https://example.com',
    };

    spectator.service.updateMetaTags(metaData);

    expect(metaPlatform.updateTag).toHaveBeenCalledTimes(6);
    expect(titlePlatform.setTitle).toHaveBeenCalledTimes(1);
    expect(titlePlatform.setTitle).toHaveBeenCalledWith(metaData.title);
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      name: 'title',
      content: metaData.title,
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      name: 'description',
      content: metaData.description,
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      property: 'og:title',
      content: metaData.title,
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      property: 'og:description',
      content: metaData.description,
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      property: 'og:image',
      content: metaData.image,
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      property: 'og:url',
      content: metaData.url,
    });
  });

  it('should use default values when metadata is empty', () => {
    spectator.service.updateMetaTags({});

    expect(metaPlatform.updateTag).toHaveBeenCalledTimes(6);
    expect(titlePlatform.setTitle).toHaveBeenCalledTimes(1);
    expect(titlePlatform.setTitle).toHaveBeenCalledWith('Ng Store');
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      name: 'title',
      content: 'Ng Store',
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      name: 'description',
      content: 'Ng Store is a store for Ng products',
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      property: 'og:image',
      content: '',
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      property: 'og:url',
      content: environment.domain,
    });
  });

  it('should merge partial metadata with default values', () => {
    const partialMetaData = {
      title: 'Custom Title',
      description: 'Custom Description',
    };

    spectator.service.updateMetaTags(partialMetaData);

    expect(titlePlatform.setTitle).toHaveBeenCalledWith('Custom Title');
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      name: 'description',
      content: 'Custom Description',
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      property: 'og:image',
      content: '', // Default value
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      property: 'og:url',
      content: environment.domain, // Default value
    });
  });

  it('should handle empty strings in metadata', () => {
    const emptyValuesMetaData = {
      title: '',
      description: '',
      image: '',
      url: '',
    };

    spectator.service.updateMetaTags(emptyValuesMetaData);

    expect(titlePlatform.setTitle).toHaveBeenCalledWith('');
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      name: 'title',
      content: '',
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      name: 'description',
      content: '',
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      property: 'og:url',
      content: '',
    });
  });

  it('should handle special characters in metadata', () => {
    const specialCharsMetaData = {
      title: 'Title with <script>alert("XSS")</script>',
      description: 'Description with & < > " \' special chars',
      image: 'image-with-spaces and special&chars.jpg',
      url: 'https://example.com/path?param=value&special=true',
    };

    spectator.service.updateMetaTags(specialCharsMetaData);

    expect(titlePlatform.setTitle).toHaveBeenCalledWith(
      specialCharsMetaData.title
    );
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      name: 'title',
      content: specialCharsMetaData.title,
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      name: 'description',
      content: specialCharsMetaData.description,
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      property: 'og:image',
      content: specialCharsMetaData.image,
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      property: 'og:url',
      content: specialCharsMetaData.url,
    });
  });

  it('should handle extremely long metadata values', () => {
    const longText = 'A'.repeat(1000);
    const longMetaData = {
      title: longText,
      description: longText,
      image: `https://example.com/images/${longText}.jpg`,
      url: `https://example.com/${longText}`,
    };

    spectator.service.updateMetaTags(longMetaData);

    expect(titlePlatform.setTitle).toHaveBeenCalledWith(longMetaData.title);
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      name: 'title',
      content: longMetaData.title,
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      property: 'og:description',
      content: longMetaData.description,
    });
  });

  it('should handle updating metadata multiple times', () => {
    // First update
    spectator.service.updateMetaTags({
      title: 'First Title',
    });

    expect(titlePlatform.setTitle).toHaveBeenCalledWith('First Title');
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      name: 'title',
      content: 'First Title',
    });

    // Reset mocks
    jest.clearAllMocks();

    // Second update
    spectator.service.updateMetaTags({
      title: 'Second Title',
      description: 'Updated description',
    });

    expect(titlePlatform.setTitle).toHaveBeenCalledWith('Second Title');
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      name: 'title',
      content: 'Second Title',
    });
    expect(metaPlatform.updateTag).toHaveBeenCalledWith({
      name: 'description',
      content: 'Updated description',
    });
  });
});
