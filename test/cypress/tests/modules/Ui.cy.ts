import { createEditorWithTextBlocks } from '../../support/utils/createEditorWithTextBlocks';
import type EditorJS from '../../../../types/index';

describe('Ui module', function () {
  describe('documentKeydown', function () {
    describe('Events outside editor', function () {
      it('should ignore keyboard events when target is outside editor', function () {
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

      it('should handle keyboard events when target is inside editor', function () {
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

    describe('Backspace', function () {
      it('should remove selected blocks', function () {
        cy.createEditor({
          data: {
            blocks: [
              {
                id: 'block1',
                type: 'paragraph',
                data: {
                  text: 'The first block',
                },
              },
              {
                id: 'block2',
                type: 'paragraph',
                data: {
                  text: 'The second block',
                },
              },
            ],
          },
        }).as('editorInstance');

        /**
         * Select two blocks by shift+down
         */
        cy.get('[data-cy=editorjs]')
          .find('.ce-paragraph')
          .first()
          .click()
          .type('{shift+downArrow}')
          .type('{backspace}');


        cy.get<EditorJS>('@editorInstance')
          .then(async (editor) => {
            const { blocks } = await editor.save();

            /**
             * Actually editor will contain 1 empty block, but save wont return it since it is empty
             */
            expect(blocks.length).to.eq(0);
          });
      });
    });

    describe('Delete', function () {
      it('should remove selected blocks', function () {
        cy.createEditor({
          data: {
            blocks: [
              {
                id: 'block1',
                type: 'paragraph',
                data: {
                  text: 'The first block',
                },
              },
              {
                id: 'block2',
                type: 'paragraph',
                data: {
                  text: 'The second block',
                },
              },
            ],
          },
        }).as('editorInstance');

        /**
         * Select two blocks by shift+down
         */
        cy.get('[data-cy=editorjs]')
          .find('.ce-paragraph')
          .first()
          .click()
          .type('{shift+downArrow}')
          .type('{del}');

        cy.get<EditorJS>('@editorInstance')
          .then(async (editor) => {
            const { blocks } = await editor.save();

            /**
             * Actually editor will contain 1 empty block, but save wont return it since it is empty
             */
            expect(blocks.length).to.eq(0);
          });
      });
    });
  });

  describe('mousedown', function () {
    it('should update current block by click on block', function () {
      createEditorWithTextBlocks([
        'first block',
        'second block',
        'third block',
      ])
        .as('editorInstance');

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .eq(1)
        .click();

      cy.get<EditorJS>('@editorInstance')
        .then(async (editor) => {
          const currentBlockIndex = await editor.blocks.getCurrentBlockIndex();

          expect(currentBlockIndex).to.eq(1);
        });
    });

    it('(in readonly) should update current block by click on block', function () {
      createEditorWithTextBlocks([
        'first block',
        'second block',
        'third block',
      ], {
        readOnly: true,
      })
        .as('editorInstance');

      cy.get('[data-cy=editorjs]')
        .find('.ce-paragraph')
        .eq(1)
        .click();

      cy.get<EditorJS>('@editorInstance')
        .then(async (editor) => {
          const currentBlockIndex = await editor.blocks.getCurrentBlockIndex();

          expect(currentBlockIndex).to.eq(1);
        });
    });
  });
});
