<script setup>
import {onMounted, ref} from 'vue';
import supportContents from "~/content/support-contents.js"

const menuId = ref(0),
    childId = ref(0),
    pageSlug = ref('/contents/'),
    currentSlug = useRoute().params.slug,
    pageTitle = ref(''),
    pageContent = ref(''),
    query = ref(''),
    queryHidden = ref(''),
    showContent = ref(false),
    showSearchList = ref(false),
    showQuickSearchList = ref(false),
    quickSearchList = ref([]),
    getQueryHidden = ref(''),
    getSearchList = ref([]),
    activeGroup = ref(null),
    listOpen = ref(false),
    $device = useDevice(),
    route = useRoute(),
    router = useRouter()

const selectedItems = supportContents.support.filter((obj) => obj.isSelected === true)

if (currentSlug) {
  const dataResult = supportContents.support.filter((obj) => obj.slug === currentSlug)
  if (dataResult.length > 0) {
    showContent.value = true
    pageTitle.value = dataResult[0].title
    pageContent.value = dataResult[0].content
    menuId.value = dataResult[0].parentId
    childId.value = dataResult[0].id
  } else {
    const route = useRoute();
    const router = useRouter();
    router.push('/404')
  }
}

const searchableList = supportContents.support.filter((obj) => obj.type === 0 && obj.parentId > 0 && obj.id !== childId.value)

const queryFilterList = () => {
  if (query.value.length === 0) {
    showSearchList.value = false
    menuId.value = 0
    childId.value = 0
  } else if (query.value.length > 2) {
    queryHidden.value = query.value
    queryHidden.value = queryHidden.value.replace(/i/g, 'İ').toUpperCase()
    showQuickSearchList.value = true
    quickSearchList.value = searchableList.filter((item) => {
      return item.title.replace(/i/g, 'İ').toUpperCase().includes(queryHidden.value);
    })
  } else {
    showQuickSearchList.value = false
    quickSearchList.value = []
  }
}

const getSearch = () => {
  if (query.value.length > 2) {
    showQuickSearchList.value = false
    showContent.value = false
    showSearchList.value = true

    getQueryHidden.value = query.value
    queryHidden.value = query.value
    queryHidden.value = queryHidden.value.replace(/i/g, 'İ').toUpperCase()
    getSearchList.value = searchableList.filter((item) => {
      return item.title.replace(/i/g, 'İ').toUpperCase().includes(queryHidden.value);
    })
  }

  listOpen.value = false
}
</script>

<template>
  <div class="support-center">
    <v-container>
      <v-row>
        <v-col cols="4">
          <v-card class="support-title">
            <v-card-text @click="router.push('/')">
              {{ $t('helpCenter.pageTitle') }}
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="8" class="support-content-search-overlay">
          <div
              class="support-content-search"
              :class="{'results-open' : showQuickSearchList}"
          >
            <div class="support-content-search-group">
              <input
                  v-model="query"
                  type="text"
                  placeholder="Arama"
                  @keyup.enter="getSearch()"
                  @input="queryFilterList"
                  maxlength="50"
              >
              <span @click="getSearch"></span>
            </div>
            <div class="support-content-search-results">
              <ul>
                <li
                    v-for="(item, index) in quickSearchList.slice(0, 6)"
                    :key="index"
                >
                  <a
                      v-if="currentSlug === item.slug"
                      :href="pageSlug+item.slug"
                  >
                    {{ item.title }}
                  </a>
                  <nuxt-link
                      v-else
                      :to="pageSlug+item.slug"
                  >
                    {{ item.title }}
                  </nuxt-link>
                </li>
              </ul>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="4">
          <v-list>
            <v-list-item
                v-if="$device.isMobile"
                @click="listOpen = !listOpen"
                :active="false"
                :title="$t('helpCenter.pageTitle')"
                class="mobile-menu"
                :class="{ 'active': listOpen}"
            />
            <div v-if="$device.isMobile ? listOpen : true">
              <v-list-group
                  v-for="(item, i) in $tm('supportSidebar')" :key="i"
                  :value="$rt(item.id)"
              >
                <template v-slot:activator="{props}">
                  <v-list-item
                      v-model="activeGroup"
                      v-bind="props"
                      :title="$rt(item.name)"
                      class="items-one"
                  />
                </template>

                <v-list-item
                    v-for="(child, j) in item.children" :key="j"
                    v-if="$rt(item.submenu) === '0'"
                    :title="$rt(child.title)"
                    :value="$rt(child.slug)"
                    :to="$rt(child.slug)"
                    class="items-no-sub"
                    :class="{ 'active': currentSlug === $rt(child.slug) && $device.isDesktop }"
                    :active="false"
                />

                <v-list-group
                    v-for="(child, j) in item.children" :key="j"
                    sub-group
                    no-action
                >
                  <template v-slot:activator="{ props }">
                    <v-list-item
                        v-if="$rt(item.submenu) === '1'"
                        v-bind="props"
                        :title="$rt(child.name)"
                        class="items-two"
                    />
                  </template>

                  <v-list-item
                      v-if="$rt(item.submenu) === '1'"
                      v-for="(subChild, k) in child.children" :key="k"
                      @click="$device.isMobile && (listOpen = false)"
                      :title="$rt(subChild.title)"
                      :value="$rt(subChild.slug)"
                      :to="$rt(subChild.slug)"
                      class="items-three"
                      :class="{ 'active': currentSlug === $rt(subChild.slug) && $device.isDesktop }"
                      :active="false"
                  />
                </v-list-group>
              </v-list-group>
            </div>
          </v-list>
        </v-col>

        <v-col cols="12" md="8">
          <v-card class="support-content">
            <v-card-title v-if="!showContent && !showSearchList">
              {{ $t('helpCenter.title') }}
            </v-card-title>

            <v-card-text v-if="!showContent && !showSearchList">
              {{ $t('helpCenter.description') }}
            </v-card-text>

            <div v-if="!showContent && !showSearchList" class="support-content-faq">
              <v-card-title>{{ $t('helpCenter.faq') }}</v-card-title>
              <ul>
                <li
                    v-for="(item, index) in selectedItems"
                    :key="index"
                >
                  <a
                      v-if="currentSlug === item.slug"
                      :href="pageSlug+item.slug"
                  >
                    {{ item.title }}
                  </a>
                  <nuxt-link
                      v-else
                      :to="pageSlug+item.slug"
                  >
                    {{ item.title }}
                  </nuxt-link>
                </li>
              </ul>
            </div>

            <div v-if="!showContent && showSearchList" class="support-content-search-list">
              <h3>"{{ getQueryHidden }}" {{ $t('helpCenter.resultText') }}</h3>
              <ul v-if="getSearchList.length > 0">
                <li
                    v-for="(item, index) in getSearchList"
                    :key="index"
                >
                  <a
                      v-if="currentSlug === item.slug"
                      :href="pageSlug+item.slug"
                  >
                    <b>{{ item.title }}</b>
                    <div v-html="item.content"></div>
                  </a>
                  <nuxt-link
                      v-else
                      :to="pageSlug+item.slug"
                  >
                    <b>{{ item.title }}</b>
                    <div v-html="item.content"></div>
                  </nuxt-link>
                </li>
              </ul>
              <div v-else class="support-content-no-result">
                <p>{{ $t('helpCenter.notResultText') }}</p>
                <v-btn @click="router.push('/')">Go Back</v-btn>
              </div>
            </div>

            <div class="support-content-text" v-if="showContent">
              <h2>{{ pageTitle }}</h2>
              <div v-html="pageContent"></div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style lang="scss" scoped>
.support-center {
  min-height: 100vh;
  height: auto;

  .v-list {
    padding: 0;
    border-radius: 6px;
    border: 1px solid #DDE5ED;
    background: #fff;

    .mobile-menu {
      padding: 20px;
      border-radius: 6px;

      :deep(.v-list-item-title) {
        font-size: 16px;
        font-weight: 500;
        line-height: 20px;
        white-space: inherit;
        color: #0A0F14;
        letter-spacing: 0;
      }

      &:before {
        position: absolute;
        content: "";
        width: 36px;
        height: 36px;
        right: 10px;
        background: url('assets/images/add-icon-green.svg') no-repeat center;
        transition: transform 0.3s ease;
      }

      &.active {
        &:after {
          content: "";
          position: absolute;
          right: 10px;
          width: 36px;
          height: 36px;
          background: url('assets/images/minus-icon-green.svg') no-repeat center;
          transition: transform 0.3s ease;
          opacity: 1;
        }

        &:before {
          display: none;
        }
      }
    }

    :deep(.v-list-item__append i) {
      background: url('assets/images/combobox-down-arrow.svg') no-repeat center;
      transition: transform 0.3s ease;
      opacity: 1;
    }

    :deep(.v-list-item--active i) {
      transform: rotate(180deg);
      opacity: 1;
    }

    .items-one {
      padding: 20px;
      border-bottom: 1px solid #DDE5ED;

      &.items-one-active {
        .v-list-item__append i {
          transform: rotate(180deg);
          opacity: 1;
        }
      }

      :deep(.v-list-item-title) {
        font-size: 16px;
        font-weight: 500;
        line-height: 20px;
        white-space: inherit;
        color: #0A0F14;
        letter-spacing: 0;
      }
    }

    .items-two {
      padding: 20px;
      border-bottom: 1px solid #DDE5ED;
      background: rgba(116, 116, 128, .08);
      cursor: pointer;

      :deep(.v-list-item-title) {
        padding-left: 4px;
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #0A0F14;
        white-space: inherit;
        letter-spacing: 0;
      }

      &:before {
        position: absolute;
        content: "";
        width: 24px;
        height: 24px;
        left: 10px;
        background: url('assets/images/subdirectory-arrow.svg') no-repeat center;
      }
    }

    .items-three {
      padding: 20px;
      border-bottom: 1px solid #DDE5ED;
      background: rgba(116, 116, 128, .08);
      cursor: pointer;

      :deep(.v-list-item-title) {
        padding-left: 4px;
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #0A0F14;
        white-space: inherit;
        letter-spacing: 0;
      }

      &:before {
        position: absolute;
        content: "";
        width: 24px;
        height: 24px;
        left: 24px;
        background: url('assets/images/list-arrow-icon.svg') no-repeat center;
      }

      &:hover {
        background: linear-gradient(90deg, rgba(0, 177, 64, .2) 0%, rgba(0, 177, 64, 0) 17.53%), rgba(116, 116, 128, .08);

        @media only screen and (max-width: 767px) {
          background: rgba(116, 116, 128, .08);
        }
      }

      &.active {
        background: linear-gradient(90deg, rgba(0, 177, 64, .2) 0%, rgba(0, 177, 64, 0) 17.53%), rgba(116, 116, 128, .08);

        :deep(.v-list-item-title) {
          color: #1B9A4A;
        }

        &:before {
          background: url('assets/images/list-arrow-icon-green.svg') no-repeat center;
        }

        &:after {
          position: absolute;
          content: "";
          top: 50%;
          transform: translateY(-50%);
          left: -7px;
          width: 14px;
          height: 44px;
          background: #00B140;
          border-radius: 7px;
        }
      }
    }

    .items-no-sub {
      padding: 20px;
      border-bottom: 1px solid #DDE5ED;
      background: rgba(116, 116, 128, .08);
      cursor: pointer;

      :deep(.v-list-item-title) {
        padding-left: 8px;
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: #0A0F14;
        white-space: inherit;
        letter-spacing: 0;
      }

      &:before {
        position: absolute;
        content: "";
        width: 24px;
        height: 24px;
        left: 12px;
        background: url('assets/images/list-arrow-icon.svg') no-repeat center;
      }

      &:hover {
        background: linear-gradient(90deg, rgba(0, 177, 64, .2) 0%, rgba(0, 177, 64, 0) 17.53%), rgba(116, 116, 128, .08);

        @media only screen and (max-width: 767px) {
          background: rgba(116, 116, 128, .08);
        }
      }

      &.active {
        background: linear-gradient(90deg, rgba(0, 177, 64, .2) 0%, rgba(0, 177, 64, 0) 17.53%), rgba(116, 116, 128, .08);

        :deep(.v-list-item-title) {
          color: #1B9A4A;
        }

        &:before {
          background: url('assets/images/list-arrow-icon-green.svg') no-repeat center;
        }

        &:after {
          position: absolute;
          content: "";
          top: 50%;
          transform: translateY(-50%);
          left: -7px;
          width: 14px;
          height: 44px;
          background: #00B140;
          border-radius: 7px;
        }
      }
    }

    :deep(.v-list-item__overlay),
    :deep(.v-list-item__underlay),
    :deep(.v-ripple__container) {
      display: none;
    }
  }

  .support-title {
    padding: 0;
    box-shadow: none;
    background: transparent;

    @media only screen and (max-width: 767px) {
      display: none;
    }

    .v-card-text {
      padding: 44px 0 43px;
      color: #0A0F14;
      font-size: 36px;
      font-weight: 700;
      line-height: 50px;
      cursor: pointer;
    }
  }

  .support-content {
    padding: 40px;
    box-shadow: none;

    @media only screen and (max-width: 767px) {
      padding: 20px;
    }

    .v-card-title {
      padding: 0;
      font-size: 16px;
      font-weight: 700;
      line-height: 22px;
      color: #000;
    }

    .v-card-text {
      padding: 16px 0 32px;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      color: #000;
    }
  }

  .support-content-search-overlay {
    align-self: center;

    .support-content-search {
      padding: 18px 14px;
      align-self: center;
      position: relative;
      display: block;
      z-index: 99;
      border-radius: 9px;
      border: 2px solid #DDE5ED;
      background: #fff;
    }
  }

  .support-content-search-group {
    position: relative;
    display: block;
    z-index: 99;

    span {
      position: absolute;
      content: "";
      width: 24px;
      height: 24px;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      background: url('assets/images/query-input-search-icon.svg') no-repeat center;
      cursor: pointer;
    }

    input[type=text] {
      position: relative;
      display: block;
      width: 100%;
      border: none;
      color: #ABABAB;
      font-size: 14px;
      font-weight: 700;
      line-height: 18px;
    }
  }

  .support-content-search-results {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    opacity: 0;
    visibility: hidden;
    border: 1px solid #D5DBE0;
    box-shadow: 0 16px 32px 0 rgba(0, 0, 0, .16);

    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      width: 100%;

      li {
        margin: 0;
        padding: 0;
        list-style: none;
        width: 100%;
        background: #fff;

        &:first-child {
          border-top: 1px solid var(--black);
        }

        &:last-child {
          border: none;
        }

        a {
          display: block;
          padding: 16px 14px;
          font-weight: 600;
          font-size: 14px;
          line-height: 24px;
          align-items: center;
          letter-spacing: 0.2px;
          color: #000;
          text-decoration: none;
          border-bottom: 1px solid #F5F5F5;

          &:hover {
            background: #F5F5F5;
          }
        }
      }
    }
  }

  .support-content-search.results-open .support-content-search-results {
    opacity: 1;
    visibility: visible;
  }

  .support-content-faq {
    position: relative;
    display: block;

    ul {
      position: relative;
      width: 100%;
      margin: 0;
      padding: 0;
      align-items: center;
      list-style: none;
      display: grid;
      grid-template-columns: repeat(2, 1fr);

      @media only screen and (max-width: 767px) {
        display: block;
      }

      li {
        display: flex;
        position: relative;
        width: 100%;
        margin: 16px 0 0;
        padding: 0;
        list-style: none;

        a {
          display: block;
          margin: 0 10px 0 24px;
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
          text-decoration: none;
          color: #0A0F14;

          &:before {
            position: absolute;
            content: "";
            width: 12px;
            height: 12px;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            background: url('assets/images/list-arrow-icon.svg') no-repeat center;
          }
        }
      }
    }

    img {
      display: block;
      margin: 32px 0 0;
    }
  }

  .support-content-search-list {
    position: relative;
    display: block;
    width: 100%;

    h3 {
      padding: 0;
      margin: 0 0 16px;
      font-weight: 700;
      font-size: 16px;
      line-height: 22px;
      color: rgba(0, 0, 0, .50);
    }

    .support-content-no-result {
      p {
        margin-bottom: 16px;
        font-size: 16px;
        font-weight: 700;
        line-height: 22px;
        color: #000;
      }

      .v-btn {
        text-transform: capitalize;
        cursor: pointer;
        letter-spacing: 0;
      }

      :deep(.v-btn__overlay),
      :deep(.v-btn__underlay),
      :deep(.v-ripple__container) {
        display: none;
      }
    }

    ul {
      position: relative;
      width: 100%;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    li {
      position: relative;
      width: 100%;
      margin: 0 0 32px;
      padding: 0;
      list-style: none;

      &:last-child {
        margin-bottom: 0;
      }

      a {
        display: block;
        color: #000;
        text-decoration: none;
        line-height: 22px;

        b {
          font-weight: 700;
          font-size: 16px;
        }

        p {
          font-weight: 400;
          font-size: 14px;
        }
      }
    }
  }

  .support-content-text {
    position: relative;
    display: block;

    h2 {
      padding: 0;
      margin: 0 0 20px;
      font-size: 18px;
      font-weight: 700;
      line-height: 22px;
      letter-spacing: 0;
      color: #000;
    }

    p {
      padding: 0;
      margin: 0;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      letter-spacing: 0;
      color: #000;

      a {
        background: #0A0F14;
        color: #fff;
        text-decoration: none;
        padding: 0 6px;
        border-radius: 3px;
      }
    }

    :deep(ul) {
      margin-top: 16px;
      list-style: disc;
    }

    :deep(li) {
      margin-top: 12px;
    }

    :deep(span) {
      display: block;
      margin-top: 12px;
    }
  }

  .support-sidebar-opener {
    position: relative;
    display: none;
    padding: 24px;
    background: #090D1D;
    border: 1px solid #1B2138;
    font-weight: 700;
    font-size: 16px;
    line-height: 22px;
    letter-spacing: 0.2px;
    color: #0A0F14;
    width: calc(100% - 48px);

    &:before {
      position: absolute;
      content: "";
      width: 20px;
      height: 2px;
      right: 24px;
      top: 50%;
      transform: translateY(-50%);
      background: #0A0F14;
      transition: 0.3s;
    }

    &:after {
      position: absolute;
      content: "";
      width: 2px;
      height: 20px;
      right: 33px;
      top: 50%;
      transform: translateY(-50%);
      background: #0A0F14;
      transition: 0.3s;
    }

    §.open {
      &:after {
        transform: translateY(-50%) rotate(-90deg);
        transition: 0.3s;
      }
    }
  }
}
</style>