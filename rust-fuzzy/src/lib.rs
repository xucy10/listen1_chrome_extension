use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn contains_fuzzy(text: &str, query: &str) -> bool {
    if query.is_empty() {
        return true;
    }
    let s = text.to_lowercase();
    let q = query.to_lowercase();
    let mut start = 0;
    for ch in q.chars() {
        if let Some(pos) = s[start..].find(ch) {
            start += pos + ch.len_utf8();
        } else {
            return false;
        }
    }
    true
}

#[wasm_bindgen]
pub fn fuzzy_score(text: &str, query: &str) -> i32 {
    if query.is_empty() {
        return 0;
    }
    let s = text.to_lowercase();
    let q = query.to_lowercase();
    let mut score = 0;
    let mut last_match = None;
    let mut start = 0;
    for ch in q.chars() {
        if let Some(pos) = s[start..].find(ch) {
            let matched_index = start + pos;
            if let Some(prev) = last_match {
                if matched_index == prev + 1 {
                    score += 10;
                } else {
                    score += 1;
                }
            } else {
                score += 5;
            }
            last_match = Some(matched_index);
            start = matched_index + ch.len_utf8();
        } else {
            return -1;
        }
    }
    score
}
