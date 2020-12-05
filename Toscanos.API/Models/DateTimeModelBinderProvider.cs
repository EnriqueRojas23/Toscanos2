using System;
using Microsoft.AspNetCore.Mvc.ModelBinding;

public class DateTimeModelBinderProvider : IModelBinderProvider
{
    public IModelBinder GetBinder(ModelBinderProviderContext context)
    {
        if (context.Metadata.ModelType == typeof(DateTime?))
        {
            return new DateTimeModelBinder();
        }

        return null;
    }
}