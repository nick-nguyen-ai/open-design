// apps/mcp-server/src/tools/render-experience.test.ts
/**
 * The `files` pointer cap must shed FONTS, never the code graph.
 *
 * Vite emits fonts into the same `assets/` directory as js and css with hashed
 * names, so the old lexicographic order interleaved them: over this very
 * bundle a cap of 50 kept 20 fonts and dropped 10 non-font files, among them
 * the entry chunk and the main stylesheet. A client that mirrors only the
 * listed pointers got a BLANK PAGE, not a page missing its fonts.
 */
import { describe, expect, it } from 'vitest';
import { rankRenderFiles } from './render-experience.js';

/** The real file list of a built bundle (117 files), names verbatim. */
const REAL_BUNDLE: string[] = [
  'assets/400-DXeee4MN.css',
  'assets/500-B5RNMq-h.css',
  'assets/600-Du24hiKA.css',
  'assets/BlueprintDeckTemplate-DwDypmoQ.css',
  'assets/BlueprintDeckTemplate-uCmtFFcF.js',
  'assets/CircuitDeckTemplate-B-QY9H6y.css',
  'assets/CircuitDeckTemplate-tFlTTpkU.js',
  'assets/CockpitTemplate-6HhOHFYk.css',
  'assets/CockpitTemplate-BUR4AwZp.js',
  'assets/CutoverTemplate-Bg8j84Yf.css',
  'assets/CutoverTemplate-Bhj-RPrr.js',
  'assets/DgmDeckShell-B_ZiuQeJ.css',
  'assets/DgmDeckShell-DZwR6NeS.js',
  'assets/DrawingOfficeTemplate-2FeaU2jr.css',
  'assets/DrawingOfficeTemplate-CXjx24io.js',
  'assets/GazetteDeckTemplate-C7l3WlJK.css',
  'assets/GazetteDeckTemplate-WUECHxvJ.js',
  'assets/IsometricDeckTemplate-BdzuaD-6.js',
  'assets/IsometricDeckTemplate-C82-WfqM.css',
  'assets/LedgerTemplate-C_bnUEf5.css',
  'assets/LedgerTemplate-E0RFPiK9.js',
  'assets/QuarterTemplate-CWXK4xtl.js',
  'assets/QuarterTemplate-Duolu4nz.css',
  'assets/SketchnoteDeckTemplate-DNZmgTNs.css',
  'assets/SketchnoteDeckTemplate-dPhbtyfF.js',
  'assets/TMinusTemplate-DefQCyAv.css',
  'assets/TMinusTemplate-iQKIhtrD.js',
  'assets/TheLineTemplate-BIM5AeRz.js',
  'assets/TheLineTemplate-BkxfK21Y.css',
  'assets/caveat-cyrillic-400-normal-9cDH9rLW.woff2',
  'assets/caveat-cyrillic-400-normal-CebvvJET.woff',
  'assets/caveat-cyrillic-700-normal-BIyejhEL.woff2',
  'assets/caveat-cyrillic-700-normal-Bhcx9qBB.woff',
  'assets/caveat-cyrillic-ext-400-normal-3iEGd-c5.woff2',
  'assets/caveat-cyrillic-ext-400-normal-Cg0RnRQ5.woff',
  'assets/caveat-cyrillic-ext-700-normal-CrK2-ngJ.woff2',
  'assets/caveat-cyrillic-ext-700-normal-DjFGiEhD.woff',
  'assets/caveat-latin-400-normal-BzhAQZkN.woff',
  'assets/caveat-latin-400-normal-D6LQsQ_v.woff2',
  'assets/caveat-latin-700-normal-D8_1Nw6V.woff2',
  'assets/caveat-latin-700-normal-cPyBTTZN.woff',
  'assets/caveat-latin-ext-400-normal-D7hBUiug.woff2',
  'assets/caveat-latin-ext-400-normal-DtiRFvw0.woff',
  'assets/caveat-latin-ext-700-normal-DFbRgDry.woff2',
  'assets/caveat-latin-ext-700-normal-DjJQd59I.woff',
  'assets/fraunces-latin-ext-opsz-normal-CJcjJNj7.woff2',
  'assets/fraunces-latin-ext-wght-normal-Ca2vKHc0.woff2',
  'assets/fraunces-latin-opsz-normal-DihXLNYH.woff2',
  'assets/fraunces-latin-wght-normal-ukD16Tqj.woff2',
  'assets/fraunces-vietnamese-opsz-normal-Czevyj-6.woff2',
  'assets/fraunces-vietnamese-wght-normal-CnvboYUG.woff2',
  'assets/ibm-plex-mono-cyrillic-400-normal-BSMlKf0J.woff2',
  'assets/ibm-plex-mono-cyrillic-400-normal-CEL4l2ZJ.woff',
  'assets/ibm-plex-mono-cyrillic-500-normal-Ael50iVv.woff',
  'assets/ibm-plex-mono-cyrillic-500-normal-Bq9vWWag.woff2',
  'assets/ibm-plex-mono-cyrillic-600-normal-CTOM6hUh.woff2',
  'assets/ibm-plex-mono-cyrillic-600-normal-fLZuRloM.woff',
  'assets/ibm-plex-mono-cyrillic-ext-400-normal-DMdlQ8Kv.woff',
  'assets/ibm-plex-mono-cyrillic-ext-400-normal-xuaO2J-f.woff2',
  'assets/ibm-plex-mono-cyrillic-ext-500-normal-BIfNGwUT.woff',
  'assets/ibm-plex-mono-cyrillic-ext-500-normal-BqneJy0T.woff2',
  'assets/ibm-plex-mono-cyrillic-ext-600-normal-9HEixskS.woff',
  'assets/ibm-plex-mono-cyrillic-ext-600-normal-V-xxqcpd.woff2',
  'assets/ibm-plex-mono-latin-400-normal-CvHOgSBP.woff',
  'assets/ibm-plex-mono-latin-400-normal-DMJ8VG8y.woff2',
  'assets/ibm-plex-mono-latin-500-normal-CB9ihrfo.woff',
  'assets/ibm-plex-mono-latin-500-normal-DSY6xOcd.woff2',
  'assets/ibm-plex-mono-latin-600-normal-BgSNZQsw.woff2',
  'assets/ibm-plex-mono-latin-600-normal-DWFSQ4vo.woff',
  'assets/ibm-plex-mono-latin-ext-400-normal-BmRBH3aV.woff2',
  'assets/ibm-plex-mono-latin-ext-400-normal-D3D2R8hC.woff',
  'assets/ibm-plex-mono-latin-ext-500-normal-CAhNIIs5.woff2',
  'assets/ibm-plex-mono-latin-ext-500-normal-CZ70TYgx.woff',
  'assets/ibm-plex-mono-latin-ext-600-normal-D38SheWl.woff2',
  'assets/ibm-plex-mono-latin-ext-600-normal-DmB0ttJJ.woff',
  'assets/ibm-plex-mono-vietnamese-400-normal-BulugwFq.woff2',
  'assets/ibm-plex-mono-vietnamese-400-normal-DDuiU_S-.woff',
  'assets/ibm-plex-mono-vietnamese-500-normal-C8zxqsMH.woff',
  'assets/ibm-plex-mono-vietnamese-500-normal-DZ4AoWbu.woff2',
  'assets/ibm-plex-mono-vietnamese-600-normal-D2EvbN8M.woff2',
  'assets/ibm-plex-mono-vietnamese-600-normal-iLQfcSjf.woff',
  'assets/index-CuIu3maw.css',
  'assets/index-DMhfaydu.js',
  'assets/inter-B_VMY_PD.css',
  'assets/inter-cyrillic-ext-wght-normal-BOeWTOD4.woff2',
  'assets/inter-cyrillic-wght-normal-DqGufNeO.woff2',
  'assets/inter-greek-ext-wght-normal-DlzME5K_.woff2',
  'assets/inter-greek-wght-normal-CkhJZR-_.woff2',
  'assets/inter-latin-ext-wght-normal-DO1Apj_S.woff2',
  'assets/inter-latin-wght-normal-Dx4kXJAl.woff2',
  'assets/inter-vietnamese-wght-normal-CBcvBZtf.woff2',
  'assets/jsx-dev-runtime-CxmgCnQQ.js',
  'assets/opsz-B0KC5ahw.css',
  'assets/space-grotesk-latin-400-normal-BnQMeOim.woff',
  'assets/space-grotesk-latin-400-normal-CJ-V5oYT.woff2',
  'assets/space-grotesk-latin-500-normal-CNSSEhBt.woff',
  'assets/space-grotesk-latin-500-normal-lFbtlQH6.woff2',
  'assets/space-grotesk-latin-700-normal-CwsQ-cCU.woff',
  'assets/space-grotesk-latin-700-normal-RjhwGPKo.woff2',
  'assets/space-grotesk-latin-ext-400-normal-CfP_5XZW.woff2',
  'assets/space-grotesk-latin-ext-400-normal-DRPE3kg4.woff',
  'assets/space-grotesk-latin-ext-500-normal-3dgZTiw9.woff',
  'assets/space-grotesk-latin-ext-500-normal-DUe3BAxM.woff2',
  'assets/space-grotesk-latin-ext-700-normal-BQnZhY3m.woff2',
  'assets/space-grotesk-latin-ext-700-normal-HVCqSBdx.woff',
  'assets/space-grotesk-vietnamese-400-normal-B7xT_GF5.woff2',
  'assets/space-grotesk-vietnamese-400-normal-BIWiOVfw.woff',
  'assets/space-grotesk-vietnamese-500-normal-BTqKIpxg.woff',
  'assets/space-grotesk-vietnamese-500-normal-BmEvtly_.woff2',
  'assets/space-grotesk-vietnamese-700-normal-DMty7AZE.woff2',
  'assets/space-grotesk-vietnamese-700-normal-Duxec5Rn.woff',
  'assets/src-DX7WOiS4.js',
  'assets/src-DcLCSWrA.js',
  'assets/src-Dohc-dhU.js',
  'assets/src-a-N_mPrn.js',
  'assets/useDeckNavigation-DdR4xLBB.js',
  'index.html',
];

const CAP = 50;
const isFont = (p: string) => /\.(woff2?|ttf|otf|eot)$/i.test(p);
const isCode = (p: string) => /\.(m?js|css)$/i.test(p);

describe('rankRenderFiles', () => {
  const ranked = rankRenderFiles(REAL_BUNDLE.map((path) => ({ path }))).map((f) => f.path);
  const kept = ranked.slice(0, CAP);
  const dropped = ranked.slice(CAP);

  it('is a permutation of its input', () => {
    expect(ranked.length).toBe(REAL_BUNDLE.length);
    expect([...ranked].sort()).toEqual([...REAL_BUNDLE].sort());
  });

  it('pins index.html first whatever the cap', () => {
    expect(ranked[0]).toBe('index.html');
  });

  it('drops no .js or .css while it keeps a font', () => {
    expect(REAL_BUNDLE.length).toBeGreaterThan(CAP);
    expect(kept.some(isFont)).toBe(true);
    expect(dropped.filter(isCode)).toEqual([]);
  });

  it('keeps the entry chunk and the main stylesheet - the blank-page pair', () => {
    expect(kept.some((p) => /^assets\/index-.*\.js$/.test(p))).toBe(true);
    expect(kept.some((p) => /^assets\/index-.*\.css$/.test(p))).toBe(true);
  });

  it('orders every non-font ahead of every font', () => {
    const firstFont = ranked.findIndex(isFont);
    expect(firstFont).toBeGreaterThan(0);
    expect(ranked.slice(firstFont).every(isFont)).toBe(true);
  });

  it('breaks ties lexicographically within a class', () => {
    const nonFonts = ranked.filter((p) => p !== 'index.html' && !isFont(p));
    expect([...nonFonts].sort()).toEqual(nonFonts);
  });

  it('leaves a bundle smaller than the cap in the same class order', () => {
    const small = ['assets/a-x.css', 'assets/b-x.woff2', 'index.html'];
    expect(rankRenderFiles(small.map((path) => ({ path }))).map((f) => f.path)).toEqual([
      'index.html',
      'assets/a-x.css',
      'assets/b-x.woff2',
    ]);
  });
});
