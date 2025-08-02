package com.service.java_service.utils;

import java.util.Properties;

import edu.stanford.nlp.pipeline.CoreDocument;
import edu.stanford.nlp.pipeline.CoreSentence;
import edu.stanford.nlp.pipeline.StanfordCoreNLP;

public class NLPUtil {

    private final StanfordCoreNLP pipeline;

    public NLPUtil() {
        Properties props = new Properties();
        props.setProperty("annotators", "tokenize,ssplit,pos,lemma,parse,sentiment");
        pipeline = new StanfordCoreNLP(props);
    }

    public String analizarSentimiento(String texto) {
        CoreDocument doc = new CoreDocument(texto);
        pipeline.annotate(doc);

        int total = 0;
        int count = 0;

        for (CoreSentence sentence : doc.sentences()) {
            String sentiment = sentence.sentiment();
            switch (sentiment) {
                case "Very negative": total += 0; break;
                case "Negative": total += 1; break;
                case "Neutral": total += 2; break;
                case "Positive": total += 3; break;
                case "Very positive": total += 4; break;
            }
            count++;
        }

        double promedio = (count > 0) ? (double) total / count : 2;

        if (promedio < 1.5) return "NEGATIVO";
        else if (promedio < 2.5) return "NEUTRO";
        else return "POSITIVO";
    }
}