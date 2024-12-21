describe('Slash keydown', function () {
  describe('pressed in empty block', function () {
    it('should add "/" in a block and open Toolbox', () => {
      cy.createEditor({
        data: {
          blocks: [
            {
              type: 'paragraph',
              data: {
                text: '',
              },
            },
          ],
        },
      });

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .click()
        .type('/');

      /**
       * Block content should contain slash
       */
      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .invoke('text')
        .should('eq', '/');

      cy.get('[data-cy="toolbox"] .ce-popover__container')
        .should('be.visible');
    });

    [
      'ctrl',
      'cmd',
    ].forEach((key) => {
      it(`should not open Toolbox if Slash pressed with ${key}`, () => {
        cy.createEditor({
          data: {
            blocks: [
              {
                type: 'paragraph',
                data: {
                  text: '',
                },
              },
            ],
          },
        });

        cy.get('[data-cy=editorjs]')
          .find('.ce-paragraph')
          .click()
          .type(`{${key}}/`);

        cy.get('[data-cy="toolbox"] .ce-popover__container')
          .should('not.be.visible');
      });
    });
  });

  describe('pressed in non-empty block', function () {
    it('should not open Toolbox and just add the / char', () => {
      cy.createEditor({
        data: {
          blocks: [
            {
              type: 'paragraph',
              data: {
                text: 'Hello',
              },
            },
          ],
        },
      });

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .click()
        .type('/');

      cy.get('[data-cy="toolbox"] .ce-popover__container')
        .should('not.be.visible');

      /**
       * Block content should contain slash
       */
      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .invoke('text')
        .should('eq', 'Hello/');
    });
  });

  describe('pressed outside editor', function () {
    it('should not modify any text outside editor when text block is selected', () => {
      // Create editor with an empty block
      cy.createEditor({
        data: {
          blocks: [
            {
              type: 'paragraph',
              data: {
                text: '',
              },
            },
          ],
        },
      });

      // First click the plus button to open the toolbox
      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .click();

      cy.get('[data-cy="toolbox"] .ce-popover__container')
        .should('not.be.visible');

      // Get the heading text content before the slash key press
      cy.get('h1')
        .contains('Editor.js test page')
        .invoke('text')
        .then((originalText) => {
          // Simulate selecting the heading text
          cy.get('h1')
            .contains('Editor.js test page')
            .trigger('mousedown')
            .trigger('mouseup');

          // Press the slash key
          cy.get('h1')
            .contains('Editor.js test page')
            .trigger('keydown', { 
              key: '/',
              code: 'Slash',
              keyCode: 191,
              which: 191,
              ctrlKey: false,
              metaKey: false
            });

          // Verify the heading text hasn't changed
          cy.get('h1')
            .contains('Editor.js test page')
            .should('have.text', originalText);

          // Verify editor content hasn't changed and toolbox isn't open
          cy.get('[data-cy=editorjs]')
            .find('.ce-paragraph')
            .should('have.text', '');

          cy.get('[data-cy="toolbox"] .ce-popover__container')
            .should('not.be.visible');
        });
    });
  });
});

describe('CMD+Slash keydown', function () {
  it('should open Block Tunes', () => {
    cy.createEditor({
      data: {
        blocks: [
          {
            type: 'paragraph',
            data: {
              text: '',
            },
          },
        ],
      },
    });

    cy.get('[data-cy=editorjs]')
      .find('.ce-paragraph')
      .click()
      .type('{cmd}/');

    cy.get('[data-cy="block-tunes"] .ce-popover__container')
      .should('be.visible');
  });
});
