<template>
  <div class="fcc-changelog">
    <section>
      <h4> 2.0.0-rc1 <date>2023/12/28</date> </h4>
      <ul>
        <li>
          <b style="font-size:1.25em">
            순서변경을 실행 취소하면 버그에 걸릴 수 있습니다!
            <br />
            금방 수정하겠습니다!!
          </b>
        </li>
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
  padding-top: 1em;

  h4 {
    margin: 0.5em 0;
  }
  date {
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
