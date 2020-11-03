describe('Composer TEST', () => {
  before(() => {
    cy.visit('http://localhost:8080');
  });
  beforeEach(() => {
    cy.viewport('macbook-15');
  });

  context('기능 확인', () => {
    it('레이어가 없는 경우 - 첫번째 레이어 추가', () => {
      cy.get('.fc-utils__btn').contains('add').click();
      cy.get('.fc-layout__list__item').eq(0).click();
      cy.get('.fc-layer').eq(0).should('be.visible'); // 레이어 영역에서
      cy.get('.fc-block').eq(0).should('be.visible'); // 미리보기 영역에서
      cy.get('.fc-layer').should('have.length', 1);
      cy.get('.fc-block').should('have.length', 1);
    });
    it('레이어가 없는 경우 - 두번째 레이어 추가', () => {
      cy.get('.fc-utils__btn').contains('add').click();
      cy.get('.fc-layout__list__item').eq(0).click();
      cy.get('.fc-layer').eq(1).should('be.visible'); // 레이어 영역에서
      cy.get('.fc-block').eq(1).should('be.visible'); // 미리보기 영역에서
      cy.get('.fc-layer').should('have.length', 2);
      cy.get('.fc-block').should('have.length', 2);
    });
    it('레이어가 없는 경우 - 세번째 레이어 추가', () => {
      cy.get('.fc-utils__btn').contains('add').click();
      cy.get('.fc-layout__list__item').eq(0).click();
      cy.get('.fc-layer').eq(2).should('be.visible'); // 레이어 영역에서
      cy.get('.fc-block').eq(2).should('be.visible'); // 미리보기 영역에서
      cy.get('.fc-layer').should('have.length', 3);
      cy.get('.fc-block').should('have.length', 3);
    });
    it('레이어 선택', () => {
      cy.get('.fc-layer').eq(0).click();
      cy.get('.fc-layer .__item').eq(0).should('have.class', '__item--active');
      cy.get('.fc-block .fc-block__container').eq(0).should('have.class', 'fc-selected');
      cy.get('.fc-layer').eq(1).click();
      cy.get('.fc-layer .__item').eq(1).should('have.class', '__item--active');
      cy.get('.fc-block .fc-block__container').eq(1).should('have.class', 'fc-selected');
      cy.get('.fc-layer').eq(2).click();
      cy.get('.fc-layer .__item').eq(2).should('have.class', '__item--active');
      cy.get('.fc-block .fc-block__container').eq(2).should('have.class', 'fc-selected');
    });

    it('레이어 편집', () => {
      cy.get('.fc-layer').eq(0).click();
      cy.get('.fc-editor .fc-editor__form__input').eq(0).type('요소 1번');
      cy.get('.fc-selected').contains('요소 1번');

      cy.get('.fc-layer').eq(1).click();
      cy.get('.fc-editor .fc-editor__form__input').eq(0).type('요소 2번');
      cy.get('.fc-selected').contains('요소 2번');
    });

    it('레이어 요소 추가', () => {
      cy.get('.fc-editor__add-btn').eq(0).click();
      cy.get('.fc-editor__list .fc-editor__list-item').eq(0).contains('1 / 3');
      cy.get('.fc-editor__list .fc-editor__list-item').should('have.length', 1);
      cy.get('.fc-editor__add-btn').eq(0).click();
      cy.get('.fc-editor__list .fc-editor__list-item').eq(1).contains('2 / 3');
      cy.get('.fc-editor__list .fc-editor__list-item').should('have.length', 2);
      cy.get('.fc-editor__add-btn').eq(0).click();
      cy.get('.fc-editor__list .fc-editor__list-item').eq(2).contains('3 / 3');
      cy.get('.fc-editor__list .fc-editor__list-item').should('have.length', 3);
      // max상태에서 요수 추가 하려는 경우.
      cy.get('.fc-editor__add-btn').eq(0).click();
      cy.get('.fc-editor__list .fc-editor__list-item').should('have.length', 3);
    });

    it('레이어 요소 삭제', () => {
      cy.get('.fc-editor__list .fc-editor__remove-btn').eq(2).click();
      cy.get('.fc-editor__list .fc-editor__list-item').should('have.length', 2);
      cy.get('.fc-editor__list .fc-editor__remove-btn').eq(1).click();
      cy.get('.fc-editor__list .fc-editor__list-item').should('have.length', 1);
      cy.get('.fc-editor__list .fc-editor__remove-btn').eq(0).click();
      cy.get('.fc-editor__list .fc-editor__list-item').should('have.length', 0);
    });

    it('디바이스 미리보기', () => {
      cy.get('.fc-header__utils button').contains('devices').click();
      cy.get('.fc-frame-wrapper__device-btns').contains('desktop_mac').click();
      cy.get('.fc-dialog__content .fc-frame-wrapper--desktop').should('be.visible');
      cy.get('.fc-frame-wrapper__device-btns').contains('tablet_mac').click();
      cy.get('.fc-dialog__content .fc-frame-wrapper--tablet').should('be.visible');
      cy.get('.fc-frame-wrapper__device-btns').contains('phone_iphone').click();
      cy.get('.fc-dialog__content .fc-frame-wrapper--phone').should('be.visible');
      cy.get('.fc-dialog__close-btn').click();
    });

    it('도움말 보기', () => {
      cy.get('.fc-header__utils').contains('help').click();
      cy.get('.fc-dialog').should('be.visible');
      cy.get('.fc-dialog__close-btn').click();
    });

    it('레이어 즐겨찾기', () => {
      cy.get('.smooth-dnd-container .fc-layer').eq(0).contains('favorite_border').click();
      cy.get('.fc-header__favorite-layouts .fc-header__favorite-layout').should('have.length', 1);
    });

    it('레이어 가리기', () => {
      cy.get('.smooth-dnd-container .fc-layer').eq(0).contains('visibility').click();
      cy.get('.fc-block .fc-block__container').eq(0).should('have.class', 'fc-hidden');
      cy.get('.smooth-dnd-container .fc-layer').eq(0).contains('visibility_off').click();
      cy.get('.fc-block .fc-block__container').eq(0).should('not.have.class', 'fc-hidden');
    });

    it('레이어 삭제하기', () => {
      cy.get('.smooth-dnd-container .fc-layer').eq(0).contains('delete').click();
      cy.get('.smooth-dnd-container .fc-layer').should('have.length', 2);
      cy.get('.smooth-dnd-container .fc-layer').eq(0).contains('delete').click();
      cy.get('.smooth-dnd-container .fc-layer').should('have.length', 1);
      cy.get('.smooth-dnd-container .fc-layer').eq(0).contains('delete').click();
      cy.get('.smooth-dnd-container .fc-layer').should('have.length', 0);
    });
  });
});
