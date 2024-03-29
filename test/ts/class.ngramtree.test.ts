import { describe, expect, it } from '@jest/globals';
import NGramTree from '../../src/ngramtree.class';

describe('NGramTree', () => {
  it('can be created without values', () => {
    const the = new NGramTree();
    the.set('th', ['t', 'h']);
    the.set('he', ['h', 'e']);
    expect(the.get('th')).toEqual(['t', 'h']);
    expect(the.get('he')).toEqual(['h', 'e']);
  });
  it('can be created with values', () => {
    const the = new NGramTree([
      ['th', ['t', 'h']],
      ['he', ['h', 'e']],
    ]);
    expect(the.get('th')).toEqual(['t', 'h']);
    expect(the.get('he')).toEqual(['h', 'e']);
  });
  it('reports the kind of ngram it has', () => {
    const the = new NGramTree([
      ['th', ['t', 'h']],
      ['he', ['h', 'e']],
    ]);
    expect(the.ngramSize).toEqual(2);
  });
  it('reports the size of an ngram w/ nsted ones', () => {
    const the = new NGramTree([
      ['th', ['t', 'h']],
      ['he', ['h', 'e']],
    ]);
    const hes = new NGramTree([
      ['he', ['h', 'e']],
      ['es', ['e', 's']],
    ]);
    const thes = new NGramTree([
      ['the', the],
      ['hes', hes],
    ]);
    expect(thes.ngramSize).toEqual(3);
  });

  describe('item depth', () => {
    const na = ['n', 'a'];
    const at = ['a', 't'];
    const ti = ['t', 'i'];
    const io = ['i', 'o'];
    const natTree = new NGramTree([
      ['na', ...na],
      ['at', ...at],
    ]);
    const atiTree = new NGramTree([
      ['at', ...at],
      ['ti', ...ti],
    ]);
    const tioTree = new NGramTree([
      ['ti', ...ti],
      ['io', ...io],
    ]);

    const atioTree = new NGramTree([
      ['ati', atiTree],
      ['tio', tioTree],
    ]);
    const natiTree = new NGramTree([
      ['nat', natTree],
      ['ati', atiTree],
    ]);
    const natioTree = new NGramTree([
      ['nati', natiTree],
      ['atio', atioTree],
    ]);
    it('trees with bigrams are a depth of 0', () => {
      const the = new NGramTree([
        ['th', ['t', 'h']],
        ['he', ['h', 'e']],
      ]);
      expect(the.depth).toEqual(0);
    });
    it('trees with maps of bigrams are a depth of 1', () => {
      expect(natiTree.depth).toEqual(1);
    });
    it('trees with maps of maps of bigrams are a depth of 2', () => {
      expect(natioTree.depth).toEqual(2);
    });
  });
  describe('it can flatten itself', () => {
    const na = ['n', 'a'];
    const at = ['a', 't'];
    const ti = ['t', 'i'];
    const io = ['i', 'o'];
    const natTree = new NGramTree([
      ['na', ...na],
      ['at', ...at],
    ]);
    const atiTree = new NGramTree([
      ['at', ...at],
      ['ti', ...ti],
    ]);
    const tioTree = new NGramTree([
      ['ti', ...ti],
      ['io', ...io],
    ]);
    const atioTree = new NGramTree([
      ['ati', atiTree],
      ['tio', tioTree],
    ]);
    const natiTree = new NGramTree([
      ['nat', natTree],
      ['ati', atiTree],
    ]);
    const natioTree = new NGramTree([
      ['nati', natiTree],
      ['atio', atioTree],
    ]);
    it('flattens a bigram tree [na,at] to an array', () => {
      const flattendTree = natTree.flatten();
      expect(flattendTree).toEqual(['na', 'at']);
    });
    it('flattens a tree (nati) nested 1 level', () => {
      const flattendTree = natiTree.flatten();
      expect(flattendTree).toEqual(['na', 'at', 'ti']);
    });
    it('flattens a tree (natio) nested 2 levels', () => {
      const flattendTree = natioTree.flatten();
      expect(flattendTree).toEqual(['na', 'at', 'ti', 'io']);
    });
    it('flattens a tree (nati) nested 2 levels but of an ngram of my choice ', () => {
      const flattendTree = natiTree.flatten(3);
      expect(flattendTree).toEqual(['nat', 'ati']);
    });
    it('flattens a tree (natio) nested 3 levels to ngram size of 3 ', () => {
      const flattendTree = natioTree.flatten(3);
      expect(flattendTree).toEqual(['nat', 'ati', 'tio']);
    });
    it('flattens a tree (natio) nested 3 levels to ngram size of 4 ', () => {
      const flattendTree = natioTree.flatten(4);
      expect(flattendTree).toEqual(['nati', 'atio']);
    });
  });
  describe('hasDeep', () => {
    const na = ['n', 'a'];
    const at = ['a', 't'];
    const ti = ['t', 'i'];
    const io = ['i', 'o'];
    const on = ['o', 'n'];
    const natTree = new NGramTree([
      ['na', ...na],
      ['at', ...at],
    ]);
    const atiTree = new NGramTree([
      ['at', ...at],
      ['ti', ...ti],
    ]);
    const tioTree = new NGramTree([
      ['ti', ...ti],
      ['io', ...io],
    ]);
    const ionTree = new NGramTree([
      ['io', ...io],
      ['on', ...on],
    ]);
    const atioTree = new NGramTree([
      ['ati', atiTree],
      ['tio', tioTree],
    ]);
    const tionTree = new NGramTree([
      ['tio', tioTree],
      ['ion', ionTree],
    ]);
    const natiTree = new NGramTree([
      ['nat', natTree],
      ['ati', atiTree],
    ]);
    const natioTree = new NGramTree([
      ['nati', natiTree],
      ['atio', atioTree],
    ]);
    const ationTree = new NGramTree([
      ['atio', atioTree],
      ['tion', tionTree],
    ]);
    it('will find a letter one level deep', () => {
      expect(natTree.hasDeep('a')).toEqual(true);
    });
    it('will find a letter many level deep', () => {
      expect(natioTree.hasDeep('o')).toEqual(true);
    });
    it('will find an ngram of many levels deep', () => {
      expect(tionTree.hasDeep('io')).toEqual(true);
      expect(tionTree.hasDeep('ion')).toEqual(true);
    });
    it('will find an ngram few levels deep', () => {
      expect(ionTree.hasDeep('io')).toEqual(true);
      expect(ionTree.hasDeep('on')).toEqual(true);
    });
    it('will find an ngram few levels deep on a larger-ish tree', () => {
      expect(ationTree.hasDeep('ion')).toEqual(true);
      expect(ationTree.hasDeep('tion')).toEqual(true);
    });
  });
  describe('searching with hasMany, hasAny, hasWhich', () => {
    const na = ['n', 'a'];
    const at = ['a', 't'];
    const ti = ['t', 'i'];
    const io = ['i', 'o'];
    const natTree = new NGramTree([
      ['na', [...na]],
      ['at', [...at]],
    ]);
    const atiTree = new NGramTree([
      ['at', [...at]],
      ['ti', [...ti]],
    ]);
    const tioTree = new NGramTree([
      ['ti', [...ti]],
      ['io', [...io]],
    ]);
    const atioTree = new NGramTree([
      ['ati', atiTree],
      ['tio', tioTree],
    ]);
    const natiTree = new NGramTree([
      ['nat', natTree],
      ['ati', atiTree],
    ]);
    const natioTree = new NGramTree([
      ['nati', natiTree],
      ['atio', atioTree],
    ]);

    describe('hasMany', () => {
      it('will confirm  two letters at once', () => {
        expect(tioTree.hasMany(['t', 'i'])).toEqual(true);
      });
      it('will confirm  two bigrams at once', () => {
        expect(tioTree.hasMany(['ti', 'io'])).toEqual(true);
      });
      it('will confirm three bigrams at once', () => {
        expect(atioTree.hasMany(['at', 'ti', 'io'])).toEqual(true);
      });
      it('will confirm two trigrams at once', () => {
        expect(natioTree.hasMany(['nat', 'ati'])).toEqual(true);
      });
      it('will confirm three trigrams at once', () => {
        expect(natioTree.hasMany(['nat', 'ati', 'tio'])).toEqual(true);
      });
      it('will return false if sent something not in the tree', () => {
        expect(natioTree.hasMany(['nat', 'tio', 'ons'])).toEqual(false);
      });
    });
    describe('hasAny', () => {
      it('will return true if sent something not in the tree', () => {
        expect(natioTree.hasAny(['nat', 'tio', 'ons'])).toEqual(true);
      });
      it('will return false if sent nothing in the tree', () => {
        expect(natioTree.hasAny(['zi', 'qt'])).toEqual(false);
      });
    });
    describe('hasAny', () => {
      it('will return true if sent something not in the tree', () => {
        expect(natioTree.hasAny(['nat', 'tio', 'ons'])).toEqual(true);
      });
      it('will return false if sent nothing in the tree', () => {
        expect(natioTree.hasAny(['zi', 'qt'])).toEqual(false);
      });
    });
    describe('hasWhich', () => {
      it('will return the trigrams in the tree', () => {
        expect(natioTree.hasWhich(['nat', 'tio', 'ons'])).toEqual(['nat', 'tio']);
      });
      it('will return the bigrams in the tree', () => {
        expect(natioTree.hasWhich(['na', 'at', 'ti', 'on'])).toEqual(['na', 'at', 'ti']);
      });
      it('will return false if sent nothing in the tree', () => {
        expect(natioTree.hasWhich(['zi', 'qt'])).toEqual([]);
      });
    });
    describe('keyContaining', () => {
      it('will return the key containing a 1-letter ngram', () => {
        expect(atiTree.keyContaining('i')).toEqual('ti');
        expect(atiTree.keyContaining('t')).toEqual(['at', 'ti']);
        expect(natTree.keyContaining('a')).toEqual(['na', 'at']);
      });
      it('will return the key containg ti as tio', () => {
        expect(natioTree.keyContaining('ti')).toEqual('tio');
      });
      it('will return the key containing [ti, io] to tio', () => {
        expect(natioTree.keyContaining(['ti', 'io'])).toEqual('tio');
      });
      it('will return the key containing the ngram', () => {
        expect(natioTree.keyContaining('tio')).toEqual('atio');
      });
    });
  });
});
