function createFallbackSearch() {
  return {
    contains(text, query) {
      if (!text || !query) {
        return !!query === false;
      }
      return text.toLowerCase().includes(query.toLowerCase());
    },
    score() {
      return -1;
    },
    containsSync(text, query) {
      if (!text || !query) {
        return !!query === false;
      }
      return text.toLowerCase().includes(query.toLowerCase());
    },
    scoreSync() {
      return -1;
    },
  };
}

async function initFuzzySearch() {
  window.fuzzySearch = createFallbackSearch();
  try {
    const module = await import('../rust-fuzzy/pkg/fuzzy_search.js');
    if (module && typeof module.contains_fuzzy === 'function') {
      window.fuzzySearch = {
        contains(text, query) {
          return module.contains_fuzzy(text, query);
        },
        score(text, query) {
          return module.fuzzy_score(text, query);
        },
        containsSync(text, query) {
          return module.contains_fuzzy(text, query);
        },
        scoreSync(text, query) {
          return module.fuzzy_score(text, query);
        },
      };
    }
  } catch (error) {
    console.warn('WASM fuzzy search unavailable, falling back to JS search', error);
  }
}

initFuzzySearch();
