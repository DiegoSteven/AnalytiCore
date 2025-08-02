package com.service.java_service.services;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.service.java_service.model.Estado;
import com.service.java_service.model.Job;

import com.service.java_service.repositories.JobRepository;
import com.service.java_service.utils.NLPUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class JobService {

    private static final Logger logger = LoggerFactory.getLogger(JobService.class);

    private final JobRepository jobRepository;
    private final NLPUtil nlpUtil;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
        this.nlpUtil = new NLPUtil(); // Si luego lo quieres inyectar, cambia esto
    }

    public Job analizarTexto(Long jobId) {
        Optional<Job> optionalJob = jobRepository.findById(jobId);

        if (optionalJob.isPresent()) {
            Job job = optionalJob.get();
            try {
                logger.info("Iniciando análisis de texto para jobId: {}", jobId);
                job.setEstado(Estado.PROCESANDO);
                jobRepository.save(job);

                String resultado = String.valueOf(nlpUtil.analizarSentimiento(job.getTexto()).toString());
                logger.info("Resultado del análisis de sentimiento: {}", resultado);

                job.setResultado(resultado);
                job.setEstado(Estado.COMPLETADO);
                jobRepository.save(job);

                logger.info("Análisis completado para jobId: {}", jobId);

            } catch (Exception e) {
                logger.error("Error durante el análisis para jobId {}: {}", jobId, e.getMessage());
                job.setEstado(Estado.ERROR);
                job.setResultado("Error durante el análisis: " + e.getMessage());
                jobRepository.save(job);
            }
            return job;
        } else {
            logger.warn("Job con ID {} no encontrado", jobId);
            return null;
        }
    }
}
