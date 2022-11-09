import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';
import Vue from 'vue';

const requireComponent = require.context(
  // 컴포넌트들이 있는 폴더
  './components/common',
  // 하위 폴더까지 포함할 지 여부
  false,
  // 기본 컴포넌트를 찾는데 사용할 정규표현식
  /Base[A-Z]\w+\.(vue|js)$/
);

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName);
  const componentName = upperFirst(
    camelCase(
      // 폴더 위치와 무관하게 파일이름 추출
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  );

  // 컴포넌트를 전역적으로 등록
  Vue.component(
    componentName,
    componentConfig.default || componentConfig
  )
});

// export default Vue;
