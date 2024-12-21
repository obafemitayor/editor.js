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
    it('should not make any changes when target is outside editor', function () {
      // Create editor with a paragraph block
      cy.createEditor({
        data: {
          blocks: [
            {
              type: 'paragraph',
              data: {
                text: 'Editor content',
              },
            },
          ],
        },
      });

      // Create a contenteditable div outside the editor
      cy.get('[data-cy=editorjs]')
        .parent()
        .then(($parent) => {
          const outsideDiv = document.createElement('div');

          outsideDiv.contentEditable = 'true';
          outsideDiv.textContent = 'Text outside editor';
          outsideDiv.setAttribute('data-cy', 'outside-editor');
          $parent.append(outsideDiv);
        });

      // Select text outside editor and press slash
      cy.get('[data-cy=outside-editor]')
        .type('{selectall}')  // Select all text in the outside div
        .trigger('keydown', { key: '/' });  // Trigger slash key

      // Verify the text outside editor wasn't changed
      cy.get('[data-cy=outside-editor]')
        .should('have.text', 'Text outside editor');

      // Verify editor content wasn't affected
      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .should('have.text', 'Editor content');
    });

    it('should make changes when target is inside editor', function () {
      // Create editor with a paragraph block
      cy.createEditor({
        data: {
          blocks: [
            {
              type: 'paragraph',
              data: {
                text: 'Editor content',
              },
            },
          ],
        },
      });

      // Select text inside editor and press slash
      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .click()
        .type('{selectall}')  // Select all text in the paragraph
        .type('/');  // Type slash directly instead of triggering keydown

      // Verify the text inside editor was changed
      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .should('have.text', '/');
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
