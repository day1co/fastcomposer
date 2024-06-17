<template>
  <div class="fcc-changelog">
    <section>
      <h4> 2.1.0-pre3 <time>2024/05/31</time> </h4>
      <h5> 문제 수정 </h5>
      <ul>
        <li> 숨긴 레이어가 저장되는 문제 수정 </li>
        <li> 레이어 추가 검색 창 디자인 개선 </li>
        <li> 색상 모드 설정이 적용되지 않는 문제 수정 </li>
        <li> 저장 시 레이어 숨김이 반영되지 않는 문제 수정 </li>
      </ul>
      <h5> 신규 기능 </h5>
      <ul>
        <li> 스니펫 기능 추가 </li>
        <li> 에디터 가로 모드 추가 </li>
      </ul>
      <h4> 2.0.1 <time>2024/01/25</time> </h4>
      <ul>
        <li> 토스트 알림 스타일 수정 </li>
        <li> 그룹 값 수정 관련 디자인 문제 수정 </li>
      </ul>
    </section>
    <section>
      <h4> 2.0.0-rc3 <time>2024/01/16</time> </h4>
      <ul>
        <li> 레이어 숨김 여부가 저장되지 않는 문제 수정 </li>
        <li> 0번 레이어를 삭제하고 실행취소하면 1번이나 마지막으로 가는 문제 수정 </li>
        <li> 저장 방식 개선 </li>
      </ul>
    </section>
    <section>
      <h4> 2.0.0-rc2 <time>2024/01/12</time> </h4>
      <ul>
        <li> 단일 레이어 순서변경을 실행 취소할 때 문제를 방지 </li>
        <li> '최근 저장'이 레이어 즐겨찾기에 겹쳐 잘리는 문제 해결 </li>
        <li> 스타일시트가 적용되지 않는 문제 해결 </li>
      </ul>
    </section>
    <section>
      <h4> 2.0.0-rc1 <time>2023/12/28</time> </h4>
      <ul>
        <li>
          설정 추가
          <ul>
            <li> 테마 강제설정 </li>
            <li> 숨긴 레이어 표시 옵션 (흐리게, 빗금, 정보만, 숨기기) </li>
            <li> 즐겨찾기 얇게 표시 </li>
            <li> 레이어 얇게 표시 </li>
          </ul>
        </li>
        <li>
          레이어 목록 개선
          <ul>
            <li>체크박스 Shift+클릭으로 범위 선택 가능</li>
          </ul>
        </li>
        <li> UI 영역 크기조절 가능 </li>
        <li> 검증 기능 복구 </li>
        <li> 실행 취소 추가 (불안정할 수 있음) </li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">

.fcc-changelog {
  font-size: 0.8em;
  padding-top: .5em;

  h4, h5 {
    margin: 0.5em 0;
    font-weight: 500;
    > time {
      margin-left: .5em;
      font-weight: 400;
      opacity: 0.5;
    }
  }
  h4 {
    font-size: 1.1em;
  }
  h5 {
    font-size: 1em;
    margin-left: 1.25em;
  }
  time {
    font-weight: 300;
    font-size: 0.8em;
  }
  ul, ol {
    padding-left: 1.25em;
    li {
      list-style: initial !important;
    }
  }
}

</style>
